import { prices } from '../Prices.js';
import '../styles/Labels.css';

function Label() {
  const Handleprinter = () => {
    window.print();
  };

  return (
    <div className='lab'>
      <div className="card">
        {Object.entries(prices).map(([key, value]) => (
          <div key={key} className="labels container b-3">
            <h2 className="text-primary"> {key}</h2>
            <p className="">kg ₹{value}/-</p>
          </div>
        ))}
      </div>

      <div className="printer">
        <button onClick={() => Handleprinter()} className="btn btn-primary">
          Print
        </button>
      </div>
    </div>
  );
}

export default Label;