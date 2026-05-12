import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white fixed left-0 top-0 p-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-10">SRS AI</h1>

      <nav className="flex flex-col gap-4">
        <NavLink to="/" className="hover:text-purple-300">Dashboard</NavLink>
        <NavLink to="/upload" className="hover:text-purple-300">Upload Document</NavLink>
        <NavLink to="/history" className="hover:text-purple-300">History</NavLink>
        <NavLink to="/reports" className="hover:text-purple-300">Reports</NavLink>
        <NavLink to="/chatbot" className="hover:text-purple-300">Chatbot Assistant</NavLink>
        <NavLink to="/settings" className="hover:text-purple-300">Settings</NavLink>
        <NavLink to="/logout" className="hover:text-red-400">Logout</NavLink>
      </nav>
    </div>
  );
}
