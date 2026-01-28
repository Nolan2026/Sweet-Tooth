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

function App() {
  const inventoryData = {
    Regular,
    MilkSweets,
    DryFruitSweets,
    CoolSweets,
    Snacks
  };

  const handleInventoryUpdate = (newData) => {
    console.log('Inventory updated:', newData);
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/admin">
          <Route index element={<Bill />} />
          <Route path="bill" element={<Bill />} />
          <Route path="inventory" element={<Inventory data={inventoryData} onUpdate={handleInventoryUpdate} />} />
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