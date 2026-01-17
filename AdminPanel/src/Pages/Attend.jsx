import React, { useState } from 'react';
import '../styles/Attend.css';

function Attend() {
  const today = new Date();
  const [worker, setWorker] = useState('Charan');
  const [workdate, setWorkDate] = useState('Current');
  const [working, setWorking] = useState('Attend');
  const [current, setCurrent] = useState(today.toDateString());
  const [morning, setMorning] = useState('09:00');
  const [afternoon, setAfternoon] = useState('');
  const [evening, setEvening] = useState('');
  const [night, setNight] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      date: current,
      morning,
      afternoon,
      evening,
      night,
      status: working,
    });
  };

  const handleFetchRecords = () => {
    if (fromDate && toDate) {
      console.log('Fetching records from', fromDate, 'to', toDate);
    }
  };

  return (
    <div className="attend-container">
      <form onSubmit={handleSubmit}>
        <h2 className='Heading'>Worker Attendance </h2>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="dateMode"
              value="Current"
              checked={workdate === 'Current'}
              onChange={(e) => setWorkDate(e.target.value)}
            />
            Current Date
          </label>

          <label>
            <input
              type="radio"
              name="dateMode"
              value="Other"
              checked={workdate === 'Other'}
              onChange={(e) => setWorkDate(e.target.value)}
            />
            Other Date
          </label>

          {/* Attend/Absent Selection */}

          <label>
            <input
              type="radio"
              name="status"
              value="Attend"
              checked={working === 'Attend'}
              onChange={(e) => setWorking(e.target.value)}
            />
            Attend
          </label>

          <label>
            <input
              type="radio"
              name="status"
              value="Absent"
              checked={working === 'Absent'}
              onChange={(e) => setWorking(e.target.value)}
            />
            Absent
          </label>
        </div>

        <div className="work-select">
          <select
            className="worker"
            name="worker"
            onChange={(e) => setWorker(e.target.value)}
          >
            <option value="Charan">Charan</option>
            <option value="Chand">Chand</option>
          </select>

          {workdate === 'Other' && working === 'Attend' && (
            <div className="date-picker">
              <input type="date" onChange={(e) => setCurrent(e.target.value)} />
            </div>
          )}
        </div>
        {/* Time Input Fields */}
        {working === 'Attend' && (
          <div className="time-inputs">
            <div className="time-group">
              <label>Morning</label>
              <input
                type="time"
                value={morning}
                onChange={(e) => setMorning(e.target.value)}
              />
            </div>

            <div className="time-group">
              <label>Afternoon</label>
              <input
                type="time"
                value={afternoon}
                onChange={(e) => setAfternoon(e.target.value)}
              />
            </div>

            <div className="time-group">
              <label>Evening</label>
              <input
                type="time"
                value={evening}
                onChange={(e) => setEvening(e.target.value)}
              />
            </div>

            <div className="time-group">
              <label>Night</label>
              <input
                type="time"
                value={night}
                onChange={(e) => setNight(e.target.value)}
              />
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {/* Record Section */}
      <div className="records-section">
        <h2>Fetch Records</h2>
        <div className="date-range">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="From Date"
          />
          <span>to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="To Date"
          />
          <select name="worker" className='worker' onChange={(e) => setWorker(e.target.value)}>
            <option value="Charan">Charan</option>
            <option value="Chand">Chand</option>
          </select>

          <button
            onClick={handleFetchRecords}
            disabled={!fromDate || !toDate}
            className="fetch-btn"
          >
            Get Details
          </button>
        </div>

        <table className="records-table">
          <thead>
            <tr>
              <th className="date-column">Date</th>
              <th>Morning</th>
              <th>Afternoon</th>
              <th>Evening</th>
              <th className="night-column">Night</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-05-25</td>
              <td>09:00</td>
              <td>13:00</td>
              <td>17:00</td>
              <td>21:00</td>
            </tr>
            <tr>
              <td>2025-05-26</td>
              <td>09:15</td>
              <td>13:05</td>
              <td>17:10</td>
              <td>21:20</td>
            </tr>
            <tr>
              <td>2025-05-27</td>
              <td>09:10</td>
              <td>13:30</td>
              <td>17:20</td>
              <td>21:15</td>
            </tr>
            <tr>
              <td>2025-05-28</td>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                Absent
              </td>
            </tr>
            <tr>
              <td>2025-05-29</td>
              <td>09:05</td>
              <td>13:05</td>
              <td>17:05</td>
              <td>21:02</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attend;