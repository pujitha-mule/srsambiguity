import { useState } from "react";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="ml-64 h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6">
      <div className="font-semibold">Welcome Back 👋</div>

      <div className="flex items-center gap-6">
        <button>🔔</button>
        <button onClick={toggleDarkMode}>
          {darkMode ? "🌙" : "☀️"}
        </button>
        <div className="cursor-pointer">👤 Profile</div>
      </div>
    </div>
  );
}
