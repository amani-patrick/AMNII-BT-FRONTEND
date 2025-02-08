import { motion } from "framer-motion";

export default function Markets() {
  const selectedSymbol = "EURUSD"; 
  const selectedTimeframe = "1D";
  const selectedTheme = "light";

  const markets = [
    { name: "EUR/USD", price: "1.0852", profit: "+0.20%", loss: "-0.05%", neutral: "0.15%" },
    { name: "GBP/USD", price: "1.2645", profit: "+0.35%", loss: "-0.10%", neutral: "0.25%" },
    { name: "USD/JPY", price: "148.50", profit: "+0.50%", loss: "-0.15%", neutral: "0.35%" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Market Overview</h1>

      {/* Scrolling Market Cards (Framer Motion) */}
      <div className="overflow-hidden w-full">
        <motion.div
          className="flex space-x-6"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ width: "max-content", display: "flex" }}
        >
          {[...markets, ...markets].map((market, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-lg shadow-md text-white min-w-[200px]"
            >
              <h2 className="text-lg font-semibold">{market.price}</h2>
              <p className="text-sm">{market.name}</p>
              <div className="mt-2 text-xs">
                <p className="text-green-400">Profit: {market.profit}</p>
                <p className="text-red-400">Loss: {market.loss}</p>
                <p>Neutral: {market.neutral}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* TradingView Widget */}
      <div className="mt-4 w-full">
        <iframe
          src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${selectedSymbol}&symbol=${selectedSymbol}&interval=${selectedTimeframe}&theme=${selectedTheme}`}
          width="100%"
          height="500"
          allowFullScreen
          className="rounded-lg shadow-md"
        ></iframe>
      </div>
    </div>
  );
}