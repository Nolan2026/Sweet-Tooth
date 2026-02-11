import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/Attend.css';
import { useToast } from '../Context/ToastContext';
import { useConfirm } from '../Context/ConfirmContext';

function Attend() {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isPresent, setIsPresent] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Add employee form
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    phone: '',
    role: 'Staff'
  });

  // Filters
  const [filter, setFilter] = useState({
    employeeId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/admin/attendance/employees');
      setEmployees(res.data.filter(emp => emp.isActive));
    } catch (err) {
      console.error('Fetch employees error:', err);
      showToast('Failed to fetch employees', 'error');
    }
  };

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.employeeId) params.append('employeeId', filter.employeeId);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);

      const res = await api.get(`/admin/attendance?${params.toString()}`);
      setAttendanceRecords(res.data);
    } catch (err) {
      console.error('Fetch attendance error:', err);
      showToast('Failed to fetch attendance records', 'error');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name.trim()) {
      showToast('Employee name is required', 'warning');
      return;
    }

    if (!newEmployee.phone || newEmployee.phone.length !== 10) {
      showToast('Phone number must be 10 digits', 'warning');
      return;
    }
    // http://localhost:5016/admin/attendance/employees
    try {
      await api.post('/admin/attendance/employees', newEmployee);
      setNewEmployee({ name: '', phone: '', role: 'Staff' });
      fetchEmployees();
      showToast('Employee added successfully', 'success');
    } catch (err) {
      console.error('Add employee error:', err);
      showToast('Failed to add employee', 'error');
    }
  };

  const handleRemoveEmployee = async (id) => {
    const isConfirmed = await confirm("Remove Employee", "Are you sure you want to remove this employee and mark them as inactive?");
    if (!isConfirmed) return;

    try {
      await api.delete(`/admin/attendance/employees/${id}`);
      fetchEmployees();
      showToast('Employee removed successfully', 'success');
    } catch (err) {
      console.error('Remove employee error:', err);
      showToast('Failed to remove employee', 'error');
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      showToast('Please select an employee', 'warning');
      return;
    }

    try {
      await api.post('/admin/attendance', {
        employeeId: selectedEmployee,
        isPresent: isPresent,
        date: attendanceDate
      });
      showToast('Attendance recorded successfully', 'success');
      setSelectedEmployee('');
      fetchAttendance();
    } catch (err) {
      console.error('Mark attendance error:', err);
      showToast('Failed to record attendance', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="attend-container">
      {/* Add Employee Section */}
      <div className="section-card">
        <h2>Add New Employee</h2>
        <form onSubmit={handleAddEmployee} className="employee-form">
          <input
            type="text"
            placeholder="Employee Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Phone Number"
            value={newEmployee.phone}
            onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
          />
          <select
            value={newEmployee.role}
            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
          >
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
            <option value="Helper">Helper</option>
          </select>
          <button type="submit" className="submit-btn">Add Employee</button>
        </form>
      </div>

      {/* Employees List */}
      <div className="section-card">
        <h2>Employees</h2>
        <div className="employees-list">
          {employees.length === 0 ? (
            <p>No employees found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.phone || 'N/A'}</td>
                    <td>{emp.role}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveEmployee(emp.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mark Attendance Section */}
      <div className="section-card attendence-section">
        <h2>Mark Attendance</h2>
        <form onSubmit={handleMarkAttendance} className="attendance-form">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
          >
            <option value="">-- Select Employee --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            required
          />

          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={isPresent === true}
                onChange={() => setIsPresent(true)}
              />
              Present
            </label>
            <label>
              <input
                type="radio"
                checked={isPresent === false}
                onChange={() => setIsPresent(false)}
              />
              Absent
            </label>
          </div>

          <button type="submit" className="submit-btn">Mark Attendance</button>
        </form>
      </div>

      {/* Attendance Records */}
      <div className="section-card">
        <h2>Attendance Records</h2>

        <div className="filters-section">
          <select
            value={filter.employeeId}
            onChange={(e) => setFilter({ ...filter, employeeId: e.target.value })}
          >
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            placeholder="From"
          />

          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            placeholder="To"
          />

          <button onClick={fetchAttendance} className="fetch-btn">
            Fetch Records
          </button>
        </div>

        <div className="records-table-container">
          {attendanceRecords.length === 0 ? (
            <p>No records found. Click "Fetch Records" to load data.</p>
          ) : (
            <table className="records-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map(record => (
                  <tr key={record.id}>
                    <td>{record.employee.name}</td>
                    <td>{formatDate(record.date)}</td>
                    <td>
                      <span className={record.isPresent ? 'status-present' : 'status-absent'}>
                        {record.isPresent ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attend;