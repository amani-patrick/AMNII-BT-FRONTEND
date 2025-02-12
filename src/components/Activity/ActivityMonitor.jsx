import PropTypes, { string, arrayOf, shape } from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";

const ActivityMonitor = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("https://amnii-bt.onrender.com/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrades(response.data);
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    };

    fetchTrades();
  }, []);

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">ACTIVITY</h2>
        <a href="#" className="text-blue-400 text-sm">
          More Activity →
        </a>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 shadow-lg">
        {trades.length === 0 ? (
          <p className="text-center text-white">No activities yet</p> 
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm uppercase">
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Take Profit</th>
                <th className="pb-3">Stop Loss</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Symbol</th>
                <th className="pb-3">Created At</th> {/* New column for created_at */}
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr key={index} className="border-t border-white/20 text-sm">
                  <td
                    className={`${
                      trade.status === "pending" || trade.status === "Pending"
                        ? "text-yellow-300"
                        : "text-green-300"
                    }`}
                  >
                    {trade.status}
                  </td>
                  <td>{trade.status === "completed" ? "Completed" : "Pending"}</td>
                  <td>{trade.take_profit ? `$${trade.take_profit}` : "N/A"}</td>
                  <td>{trade.stop_loss ? `$${trade.stop_loss}` : "N/A"}</td>
                  <td>{trade.quantity}</td>
                  <td>{trade.symbol || "N/A"}</td>
                  <td>{trade.created_at || "N/A"}</td> {/* Display created_at */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

ActivityMonitor.propTypes = {
  trades: arrayOf(
    shape({
      status: string.isRequired,
      action: string.isRequired,
      take_profit: string,
      stop_loss: string,
      quantity: PropTypes.number.isRequired,
      symbol: string.isRequired,
      created_at: string, // Added created_at to prop types
    })
  ).isRequired,
};

export default ActivityMonitor;
