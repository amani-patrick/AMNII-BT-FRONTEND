import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

const AssetCard = ({ symbol }) => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchForexData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/markets/forex/${symbol}/`);
        setPrice(parseFloat(response.data.exchange_rate));
      } catch (error) {
        console.error("Error fetching forex data:", error);

        // Handle unauthorized access without navigating to login
        if (error.response && error.response.data.message === "Unauthorised! Access denied ") {
          console.warn("Session expired. Please log in again."); // Placeholder message
        }
      }
    };

    fetchForexData();
    const interval = setInterval(fetchForexData, 30000); // Refresh data every 30 seconds

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl shadow-lg w-64 text-center">
      <div className="text-lg font-semibold">{symbol}</div>
      <div className="text-2xl font-bold">{price !== null ? `$${price.toFixed(5)}` : "Loading..."}</div>
    </div>
  );
};

AssetCard.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default AssetCard;
