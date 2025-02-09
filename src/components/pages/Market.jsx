import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Markets() {
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
  const selectedTimeframe = "1D";
  const selectedTheme = "light";

  const [marketData, setMarketData] = useState({
    EURUSD: null,
    GBPUSD: null,
    AUDCAD: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          console.error("No access token found in local storage");
          return;
        }

        const response = await fetch(`http://localhost:8000/api/analytics/${selectedSymbol}/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = JSON.stringify(errorData, null, 2);
          setError(errorMessage);
          toast.error(`Error: ${errorMessage}`);
          return;
        }

        const data = await response.json();
        if (!data || !data.price) {
          setError("No market data available.");
          toast.error("No market data available.");
          return;
        }

        setMarketData((prevState) => ({
          ...prevState,
          [selectedSymbol]: data,
        }));
        setError(null);
      } catch (error) {
        console.error("Error fetching market data:", error);
        const errorMessage = error.message || "Failed to fetch market data.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    fetchMarketData();
  }, [selectedSymbol]);

  const symbols = ["EURUSD", "GBPUSD", "AUDCAD"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Market Overview</h1>

      <div className="mb-4">
        <label className="mr-2 text-lg">Select Symbol:</label>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {symbols.map((symbol) => (
          <motion.div
            key={symbol}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-lg shadow-md text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold">{symbol}</h2>
            {marketData[symbol] ? (
              <div className="mt-2 text-xs">
                <p className="text-white">Price: {marketData[symbol].price}</p>
                <p className="text-green-400">Profit: {marketData[symbol].profit}</p>
                <p className="text-red-400">Loss: {marketData[symbol].loss}</p>
                <p className="text-white">Neutral: {marketData[symbol].neutral}</p>
              </div>
            ) : error ? (
              <p className="text-gray-400 whitespace-pre-wrap">{error}</p>
            ) : (
              <p className="text-gray-400">Loading data...</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 w-full">
        <iframe
          src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${selectedSymbol}&symbol=${selectedSymbol}&interval=${selectedTimeframe}&theme=${selectedTheme}`}
          width="100%"
          height="500"
          allowFullScreen
          className="rounded-lg shadow-md"
        ></iframe>
      </div>

      <ToastContainer />
    </div>
  );
}
