
import React from 'react';
import { Search, Bell, Moon, Sun, UserCircle, Command, LogOut, ChevronDown } from 'lucide-react';

interface TopBarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ darkMode, setDarkMode, onLogout }) => {
  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-sm hidden md:block group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-md pl-9 pr-14 py-1.5 text-xs focus:ring-4 focus:ring-blue-500/10 dark:text-slate-200 outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-sans font-semibold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
              <Command size={10} /> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setDarkMode(false)}
            className={`p-1.5 rounded-md transition-all ${!darkMode ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Sun size={14} />
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`p-1.5 rounded-md transition-all ${darkMode ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Moon size={14} />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800 ml-2 group relative cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-none">System Admin</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">ID: AP-99210</p>
          </div>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            AD
          </div>
          <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600 transition-colors" />

          {/* Dropdown Menu (Hidden by default, shown on hover/focus - simplistic implementation) */}
          <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
            <button className="w-full text-left px-4 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
              <UserCircle size={14} /> Profile Settings
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
            <button 
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-[11px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
            >
              <LogOut size={14} /> Terminate Session
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
