import { useState } from "react";

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    login: "",
    broker_server: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAccounts([...accounts, formData]);
    setFormData({ name: "", login: "", broker_server: "", password: "" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">Accounts</h2>
        <p className="text-center text-gray-600">Manage your forex trading accounts here.</p>
        
        {/* Account Creation Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Login</label>
            <input type="text" name="login" value={formData.login} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Broker Server</label>
            <input type="text" name="broker_server" value={formData.broker_server} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg hover:bg-blue-600 transition">Create Account</button>
        </form>
      </div>

      {/* Display Available Accounts */}
      <div className="mt-8 w-full max-w-lg">
        <h3 className="text-2xl font-semibold text-center text-blue-600">Available Accounts</h3>
        {accounts.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No accounts available.</p>
        ) : (
          <ul className="mt-4 bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {accounts.map((account, index) => (
              <li key={index} className="p-4 hover:bg-gray-100 transition">
                <strong className="text-blue-700">{account.name}</strong> - {account.login} ({account.broker_server})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
