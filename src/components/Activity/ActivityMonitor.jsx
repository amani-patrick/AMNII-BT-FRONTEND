import PropTypes from "prop-types";

const ActivityMonitor = ({ trades }) => {
  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">ACTIVITY</h2>
        <a href="#" className="text-blue-400 text-sm">
          More Activity →
        </a>
      </div>

      <div className="bg-purple-600 text-white rounded-xl p-4 shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm uppercase">
              <th className="pb-3">Transactions</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={index} className="border-t border-white/20 text-sm">
                <td className="py-3 flex items-center space-x-2">
                  {/* Dynamically load the image based on assetSymbol */}
                  <img
                    src={`/icons/${trade.assetSymbol.toLowerCase()}.png`} // Correctly reference the image using assetSymbol
                    alt={trade.assetSymbol}
                    className="w-5 h-5"
                  />
                  <span>{trade.action} {trade.assetSymbol}</span>
                </td>
                <td>{trade.amount} {trade.assetSymbol}</td>
                <td>${trade.price.toFixed(2)}</td>
                <td
                  className={`${
                    trade.status === "Pending" ? "text-yellow-300" : "text-green-300"
                  }`}
                >
                  {trade.status}
                </td>
                <td>{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ActivityMonitor.propTypes = {
  trades: PropTypes.arrayOf(
    PropTypes.shape({
      assetSymbol: PropTypes.string.isRequired, // Currency pair like EURUSD
      amount: PropTypes.number.isRequired, // Amount of base currency traded
      price: PropTypes.number.isRequired, // Trade price
      action: PropTypes.oneOf(["Buy", "Sell"]).isRequired, // Action: Buy or Sell
      status: PropTypes.oneOf(["Pending", "Completed"]).isRequired,
      date: PropTypes.string.isRequired, // Trade date
    })
  ).isRequired,
};

export default ActivityMonitor;
