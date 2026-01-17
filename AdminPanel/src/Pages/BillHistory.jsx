import { useDispatch, useSelector } from 'react-redux';
import '../styles/History.css';
import { useState } from 'react';
import { deleteBill } from '../Store/slices/billSlice';

function History() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.bill);

  const [viewItems, setViewItems] = useState(null);

  const handleView = (items) => {
    setViewItems(items);
  };

  const handleDelete = (id) => {
    dispatch(deleteBill(id));
  };

  return (
    <div>
      <h2 className="billHead">Billing History of Sweet Tooth</h2>
      <div className="bill-table">
        <table>
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Bill Date</th>
              <th>Customer Name</th>
              <th>Cell No</th>
              <th>No oF Items</th>
              <th>Total</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {data.bills.map((his) => (
              <tr key={his.billNo}>
                <td>{his.billNo}</td>
                <td className="today">{his.billdate}</td>
                <td>{his.name}</td>
                <td>{his.num}</td>
                <td>{his.noItems}</td>
                <td>{his.total}</td>
                <td className="btns">
                  <button onClick={() => handleView(his)}>View</button>

                  <button onClick={() => handleDelete(his.billNo)}>
                    Delete{' '}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {viewItems && (
          <div className="bill-view">
            <h3>Bill No: {viewItems.billNo} <b className='exit'>x</b></h3>
            <p><span>Date:</span>{viewItems.billdate}</p>
            <p>
              <span>Customer:</span> {viewItems.name} | <span>Phone:</span>{viewItems.num}
            </p>
            <p>
              <span>Total Items:</span>{viewItems.noItems} | <span>Total:</span> ₹{viewItems.total}
            </p>
            <table className="view-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {viewItems.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.qty || item.grams}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
