import React from "react";
import { clearAuth, getUser } from "../utils/api";
import { LogOut } from "lucide-react";

const Navbar = ({ onLogout }) => {
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    onLogout();
  };

  return (
    <nav className="bg-slate-800 text-white ">
      <div className="mycontainer flex justify-between items-center px-4 py-4 h-14">
        <div className="logo font-bold text-white text-2xl">
          <span className="text-green-500">&lt;</span>
          <span>Pass</span>
          <span className="text-green-500">ST/&gt;</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-300 hidden md:block">
              {user.email}
            </span>
          )}
          <button
            onClick={() => window.open("https://github.com/nibir152813")}
            className="text-white bg-green-700 my-5 rounded-full flex justify-between items-center ring-white ring-2"
          >
            <img
              className="hover:invert w-10 p-1"
              src="icons/github.svg"
              alt="github logo"
            />
            <span className="font-bold px-2">GitHub</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 rounded-full flex items-center gap-2 px-4 py-2 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="font-bold hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




