
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, UserSquare2, MapPin, Fuel, Wrench, Settings, Info, 
  Target, DollarSign, History, ClipboardList, BarChart3
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Control Center', path: '/', icon: LayoutDashboard },
    { name: 'Asset Matrix', path: '/vehicles', icon: Truck },
    { name: 'Operator Deck', path: '/drivers', icon: UserSquare2 },
    { name: 'Live Tracking', path: '/tracking', icon: Target },
    { name: 'Journey Log', path: '/trips', icon: History },
    { name: 'Revenue', path: '/revenue', icon: DollarSign },
    { name: 'Ops Center', path: '/work-orders', icon: ClipboardList },
    { name: 'Telemetry', path: '/fuel', icon: Fuel },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Analytics', path: '/reports', icon: BarChart3 },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 transition-colors duration-300">
      <div className="p-5 border-b border-slate-100 dark:border-slate-900 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-sm italic">
          FT
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-black text-slate-800 dark:text-white leading-tight truncate tracking-tight">FleetTrack<span className="text-blue-600 font-medium">Pro</span></p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enterprise v3.2</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150
              ${isActive 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'}
            `}
          >
            {({ isActive }) => (
              <div className="flex items-center gap-2.5">
                <item.icon 
                  size={14} 
                  className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} 
                />
                <span className="text-[11px] uppercase tracking-tight">{item.name}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100 dark:border-slate-900 space-y-1">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-all">
          <Settings size={14} />
          <span>PREFERENCES</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
