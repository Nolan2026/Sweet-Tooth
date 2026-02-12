import './styles/App.css';
import Bill from './Component/Bill';
import Header from './Component/Header';
import Inventory from './Pages/Inventory';
import Attend from './Pages/Attend.jsx';
import Orders from './Pages/Orders.jsx';
import Messages from './Pages/Messages.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import History from './Pages/BillHistory';
import Label from './Pages/Labels';
import AddItem from './Pages/AddItem';
import Edit from './Component/Edit';
import UploadTest from './Pages/UploadTest.jsx';
import OrderLabel from './Pages/OrderLabel.jsx';
import AdminProfile from './Pages/AdminProfile.jsx';
import Coupons from './Pages/Coupons';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        <Route path="/admin" element={<ProtectedRoute><Bill /></ProtectedRoute>} />
        <Route path="/admin/bill" element={<ProtectedRoute><Bill /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/uploads" element={<ProtectedRoute><UploadTest /></ProtectedRoute>} />
        <Route path="/admin/shipLabel" element={<ProtectedRoute><OrderLabel /></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
        <Route path="/admin/attend" element={<ProtectedRoute><Attend /></ProtectedRoute>} />
        <Route path="/admin/label" element={<ProtectedRoute><Label /></ProtectedRoute>} />
        <Route path="/admin/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/admin/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="/admin/coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />


        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;