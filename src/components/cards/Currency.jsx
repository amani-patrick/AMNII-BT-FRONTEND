import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Smooth animations

const AssetCard = ({ symbol, updateInterval }) => {
  const [price, setPrice] = useState(null);
  const [prevPrice, setPrevPrice] = useState(null);
  const [priceColor, setPriceColor] = useState("text-white");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchForexData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`https://amnii-bt.onrender.com/api/markets/forex/${symbol}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const newPrice = parseFloat(response.data.exchange_rate);

        // Determine price color (green for increase, red for decrease)
        if (prevPrice !== null) {
          if (newPrice > prevPrice) {
            setPriceColor("text-green-400"); // Green for increase
          } else if (newPrice < prevPrice) {
            setPriceColor("text-red-400"); // Red for decrease
          } else {
            setPriceColor("text-gray-300"); // Neutral
          }
        }

        setPrevPrice(newPrice);
        setPrice(newPrice);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching forex data:", error);
        if (error.response && error.response.data.message === "Unauthorised! Access denied ") {
          console.warn("Session expired. Please log in again.");
        }
      }
    };

    fetchForexData();
    const interval = setInterval(fetchForexData, updateInterval); // Refresh at the given interval

    return () => clearInterval(interval);
  }, [symbol, prevPrice, updateInterval]);

  return (
    <motion.div 
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg w-72 text-center border border-gray-700 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-xl font-semibold">{symbol}</div>
      
      <motion.div
        className={`text-3xl font-bold ${priceColor} mt-2`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {price !== null ? `$${price.toFixed(5)}` : "Fetching Data..."}
      </motion.div>

      <div className="text-xs text-gray-400 mt-2">
        {lastUpdated ? `Last updated: ${lastUpdated}` : "Waiting for data..."}
      </div>
    </motion.div>
  );
};

AssetCard.propTypes = {
  symbol: PropTypes.string.isRequired,
  updateInterval: PropTypes.number.isRequired,
};

export default AssetCard;
