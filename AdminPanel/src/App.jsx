import './styles/App.css';
import Bill from './Component/Bill';
import Header from './Component/Header';
import Inventory from './Pages/Inventory';
import Attend from './Pages/Attend.jsx';


import { Regular, MilkSweets, DryFruitSweets, CoolSweets, Snacks } from './Store/Cost';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import History from './Pages/BillHistory';
import Label from './Pages/Labels';
import AddItem from './Pages/AddItem';
import Edit from './Component/Edit';
import UploadTest from './Pages/UploadTest.jsx';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/admin">
          <Route index element={<Bill />} />
          <Route path="bill" element={<Bill />} />
          <Route path="uploads" element={<UploadTest />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="edit/:id" element={<Edit/>} />
          <Route path="attend" element={<Attend />} />
          <Route path="label" element={<Label />} />
          <Route path="history" element={<History />} />
          <Route path="add-item" element={<AddItem />} />
        </Route>
        {/* Redirect root to /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;