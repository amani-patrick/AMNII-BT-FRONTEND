import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileSidebar() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [accounts, setAccounts] = useState([]); // State to store accounts with their statuses

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("No access token found. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch user data
        const response = await axios.get("http://localhost:8000/api/user/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        console.log("User Data:", response.data);

        // Fetch account balances and statuses
        const accountsResponse = await axios.get("http://localhost:8000/api/accounts/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch the status of each account
        const accountsWithStatus = await Promise.all(
          accountsResponse.data.map(async (account) => {
            const statusResponse = await axios.post(
              "http://localhost:8000/api/bot/status/",
              { account_name: account.name },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return { ...account, status: statusResponse.data.status }; // Add status to each account
          })
        );

        setAccounts(accountsWithStatus); // Set accounts with statuses
        const total = accountsResponse.data.reduce(
          (sum, account) => sum + parseFloat(account.balance || 0),
          0
        );
        setTotalBalance(total.toFixed(2));
      } catch (err) {
        if (err.response) {
          setError(err.response.data.detail || "Failed to load user data.");
        } else if (err.request) {
          setError("Server failed to respond");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run only once when component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Check if any account is running
  const isAnyAccountRunning = accounts.some(account => account.status === "running");

  return (
    <div className="w-72 bg-white p-6 shadow-lg rounded-lg flex flex-col h-screen">
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <img
          src={userData.profile_picture || "https://randomuser.me/api/portraits/men/1.jpg"}
          className="w-20 h-20 rounded-full mt-4"
          alt="Profile"
        />
        <h3 className="text-lg font-semibold mt-2">{userData.username}</h3>
      </div>

      {/* Asset Value */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 font-medium">Balance</p>
        <p className="text-lg font-bold text-black">${totalBalance || 0}</p>
      </div>

      {/* Open Trades */}
      <div className="mt-6 flex-1 overflow-y-auto scrollbar-hidden">
        <h3 className="text-lg font-bold">Open Trades</h3>
        <ul className="mt-2 space-y-4">
          {userData.trades && userData.trades.length > 0 ? (
            userData.trades.map((trade, index) => (
              <li key={index} className="text-sm text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{trade.symbol}</span>
                  <span
                    className={`${
                      trade.pnl > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {trade.pnl > 0
                      ? `+${(trade.pnl * 10000).toFixed(2)} Pips`
                      : `-${(Math.abs(trade.pnl) * 10000).toFixed(2)} Pips`}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Entry: {trade.entry_price}</span>
                  <span>Current: {trade.current_price}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>TP: {trade.take_profit}</span>
                  <span>SL: {trade.stop_loss}</span>
                </div>
                <div className="mt-2">
                  <span
                    className={`${
                      trade.status === "Open"
                        ? "text-yellow-400"
                        : trade.pnl > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {trade.status}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No open trades</li>
          )}
        </ul>
      </div>

      {/* Status Button */}
      <div className="mt-auto">
        <div>
          <button
            className={`w-full bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-md`}
          >
            <span
              className={`w-3 h-3 rounded-full ${
                isAnyAccountRunning ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="font-medium">
              {isAnyAccountRunning ? "Running" : "Not Running"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
