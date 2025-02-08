import { useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="mt-6 bg-white p-4 shadow-lg rounded-lg">
        <h2 className="text-lg font-bold mb-2">Preferences</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium">Theme</label>
          <select 
            className="p-2 border rounded-lg w-full" 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        
        <div className="mb-4 flex items-center">
          <input 
            type="checkbox" 
            id="notifications" 
            className="mr-2" 
            checked={notifications} 
            onChange={() => setNotifications(!notifications)}
          />
          <label htmlFor="notifications" className="text-sm font-medium">Enable Notifications</label>
        </div>
      </div>
    </div>
  );
}
