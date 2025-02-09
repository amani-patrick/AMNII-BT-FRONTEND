import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    broker: "",
    account_number: "",
    broker_server: "",
    balance: "",
    password: "",
  });
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Set the base URL for API requests
  const apiUrl = "http://localhost:8000/api/accounts/";
  const botApiUrl = "http://localhost:8000/api/bot/";

  // Retrieve access token from localStorage
  const accessToken = localStorage.getItem("access_token");

  // Axios instance with Authorization header
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await axiosInstance.get("/");
      const accountsWithStatus = await Promise.all(
        response.data.map(async (account) => {
          const statusResponse = await axios.post(
            `${botApiUrl}status/`,
            { account_name: account.name },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          return { ...account, status: statusResponse.data.status };
        })
      );
      setAccounts(accountsWithStatus);
    } catch (error) {
      setErrorMessage("Error fetching accounts.");
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch accounts when the component mounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: formData.name,
        broker: formData.broker,
        account_number: formData.account_number,
        broker_server: formData.broker_server,
        balance: formData.balance,
        password: formData.password,
      };

      if (editingAccountId) {
        await axiosInstance.put(`${editingAccountId}/update/`, payload);
        setEditingAccountId(null);
      } else {
        await axiosInstance.post("/add/", payload);
      }

      setFormData({
        name: "",
        broker: "",
        account_number: "",
        broker_server: "",
        balance: "",
        password: "",
      });
      fetchAccounts();
      toast.success(
        editingAccountId ? "Account updated successfully!" : "Account created successfully!"
      );
    } catch (error) {
      setErrorMessage("Error submitting account.");
      console.error("Error submitting account:", error);
      toast.error("Error submitting account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (account) => {
    setFormData({
      name: account.name,
      broker: account.broker,
      account_number: account.account_number,
      broker_server: account.broker_server,
      balance: account.balance,
      password: account.password,
    });
    setEditingAccountId(account.id);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await axiosInstance.delete(`${id}/delete/`);
      fetchAccounts();
      toast.success("Account deleted successfully!");
    } catch (error) {
      setErrorMessage("Error deleting account.");
      console.error("Error deleting account:", error);
      toast.error("Error deleting account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartBot = async (account) => {
    const payload = {
      account_name: account.name,
      login: account.account_number, 
      server: account.broker_server,
      password: account.password, 
    };
  
    try {
      await axios.post(
        `${botApiUrl}start/`,
        payload, // Sends the correctly formatted payload
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.success(`Bot for account ${account.name} started successfully!`);
      fetchAccounts(); // Refresh status after starting the bot
    } catch (error) {
      console.error("Error starting bot:", error);
      toast.error(`Failed to start bot for account ${account.name}.`);
    }
  };
  
  const handleStopBot = async (account) => {
    try {
      await axios.post(
        `${botApiUrl}stop/`,
        { account_name: account.name },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.success(`Bot for account ${account.name} stopped successfully!`);
      fetchAccounts(); // Refresh status
    } catch (error) {
      console.error("Error stopping bot:", error);
      toast.error(`Failed to stop bot for account ${account.name}.`, error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer />
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Accounts</h2>
        <p className="text-center text-gray-600 mb-6">Manage your forex trading accounts here.</p>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mt-4 mb-6">{errorMessage}</div>
        )}

        {/* Account Creation / Editing Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="broker" className="block text-sm font-medium text-gray-700">
              Broker
            </label>
            <input
              type="text"
              name="broker"
              id="broker"
              value={formData.broker}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              name="account_number"
              id="account_number"
              value={formData.account_number}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="broker_server" className="block text-sm font-medium text-gray-700">
              Broker Server
            </label>
            <input
              type="text"
              name="broker_server"
              id="broker_server"
              value={formData.broker_server}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
              Balance
            </label>
            <input
              type="text"
              name="balance"
              id="balance"
              value={formData.balance}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className={`w-full p-4 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 focus:outline-none transition cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : editingAccountId ? "Update Account" : "Create Account"}
          </button>
        </form>
      </div>

      {/* Display Available Accounts */}
      <div className="mt-8 w-full max-w-lg">
        <h3 className="text-2xl font-semibold text-center text-blue-600 mb-4">Available Accounts</h3>
        {isLoading ? (
          <p className="text-center text-gray-500 mt-4">Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No accounts available.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-blue-700">{account.name}</strong>
                    <p className="text-gray-600">{account.broker_server}</p>
                    <p className="text-gray-600">Balance: ${account.balance}</p>
                    <p
                      className={`text-sm font-semibold ${
                        account.status === "running" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      Status: {account.status}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleStartBot(account)}
                      className="text-green-500 hover:text-green-700 cursor-pointer"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleStopBot(account)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Stop
                    </button>
                    <button
                      onClick={() => handleEdit(account)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
