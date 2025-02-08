import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ActivityMonitor from "./activity/ActivityMonitor";
import AssetCard from "./cards/Currency";

export default function MainContent() {
  const location = useLocation();
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("15");
  const [selectedTheme, setSelectedTheme] = useState("light");

  // Define dynamic breadcrumbs based on the current route
  const breadcrumbs = {
    "/": "Dashboard > Home",
    "/markets": "Dashboard > Markets",
    "/reports": "Dashboard > Reports",
    "/settings": "Dashboard > Settings",
  };

  return (
    <div className="flex-1 p-6">
      {/* Dynamic Breadcrumbs */}
      <h1 className="text-2xl font-semibold">{breadcrumbs[location.pathname] || "Dashboard"}</h1>

      <Routes>
        {/* Home Page */}
        <Route path="/" element={
          <>
            {/* Assets Section */}
            <section className="mt-6 grid grid-cols-3 gap-4">
              <AssetCard name="Bitcoin" value="1,820" profit="2.87" loss="0.17" neutral="2.70" />
              <AssetCard name="Ethereum" value="1,100" profit="2.87" loss="0.10" neutral="1.50" />
              <AssetCard name="Dogecoin" value="239,500" profit="0.20" loss="0.05" neutral="0.15" />
            </section>

            {/* Activity Monitor */}
            <section className="mt-6">
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h2 className="text-lg font-bold mb-2">Activity</h2>
                <ActivityMonitor trades={[
                  { asset: "Ethereum", amount: 0.0154, assetSymbol: "ETH", price: 10, status: "Pending", date: "February 21, 2021" },
                  { asset: "Bitcoin", amount: 0.3, assetSymbol: "BTC", price: 140, status: "Done", date: "February 14, 2021" },
                  { asset: "Bitcoin", amount: 0.025, assetSymbol: "BTC", price: 80.5, status: "Done", date: "January 14, 2021" },
                ]} />
              </div>
            </section>
          </>
        } />

        {/* Markets Page */}
        <Route path="/markets" element={
          <div className="bg-white p-4 shadow-lg rounded-lg w-full overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Market</h2>

            {/* Dropdowns Section */}
            <div className="grid grid-cols-4 gap-9 space-x-12 justify-center">
              {/* Symbol Selector */}
              <select className="p-2 border rounded-lg" value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)}>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="BTCUSD">BTCUSD</option>
                <option value="ETHUSD">ETHUSD</option>
              </select>

              {/* Timeframe Selector */}
              <select className="p-2 border rounded-lg" value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)}>
                <option value="1">1m</option>
                <option value="5">5m</option>
                <option value="15">15m</option>
                <option value="60">1h</option>
                <option value="240">4h</option>
                <option value="1D">1D</option>
              </select>

              {/* Theme Selector */}
              <select className="p-2 border rounded-lg" value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* TradingView Embedded Widget */}
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
        } />

        {/* Reports Page */}
        <Route path="/reports" element={
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-bold">Reports</h2>
            <p>Coming soon...</p>
          </div>
        } />

        {/* Settings Page */}
        <Route path="/settings" element={
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-bold">Settings</h2>
            <p>Manage your preferences here.</p>
          </div>
        } />
      </Routes>
    </div>
  );
}
