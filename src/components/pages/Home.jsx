/* eslint-disable no-unused-vars */
import { useState } from "react";
import ActivityMonitor from "../activity/ActivityMonitor";
import AssetCard from "../cards/Currency";

export default function Home() {
    const [trades, setTrades] = useState([
        {
          assetSymbol: "EURUSD",
          amount: 1000,
          price: 1.0980,
          action: "Buy",
          status: "Completed",
          date: "2025-02-06 10:00",
        },
        {
          assetSymbol: "GBPUSD",
          amount: 500,
          price: 1.2635,
          action: "Sell",
          status: "Pending",
          date: "2025-02-06 10:05",
        },
        {
          assetSymbol: "AUDCAD",
          amount: 2000,
          price: 0.8920,
          action: "Buy",
          status: "Completed",
          date: "2025-02-06 10:10",
        },
      ]);

  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("15");
  const [selectedTheme, setSelectedTheme] = useState("light");

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-semibold">Dashboard &gt; Home</h1>

      <section className="mt-6 grid grid-cols-3 gap-4">
        <AssetCard symbol="EURUSD" />
        <AssetCard symbol="GBPUSD" />
        <AssetCard symbol="AUDCAD" />
      </section>

      <section className="mt-6 flex flex-col space-y-6">
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-lg font-bold mb-2">Activity</h2>
          <ActivityMonitor trades={trades} />
        </div>

        <div className="bg-white p-4 shadow-lg rounded-lg w-full overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">Market</h2>

          <div className="grid grid-cols-4 gap-9 space-x-12 justify-center">
            <select className="p-2 border rounded-lg" value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)}>
              <option value="EURUSD">EURUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="BTCUSD">BTCUSD</option>
              <option value="ETHUSD">ETHUSD</option>
            </select>
            
            <select className="p-2 border rounded-lg" value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)}>
              <option value="1">1m</option>
              <option value="5">5m</option>
              <option value="15">15m</option>
              <option value="60">1h</option>
              <option value="240">4h</option>
              <option value="1D">1D</option>
            </select>
            
            <select className="p-2 border rounded-lg" value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
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
        </div>
      </section>
    </div>
  );
}
