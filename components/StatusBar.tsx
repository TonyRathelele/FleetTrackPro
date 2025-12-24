
import React, { useState, useEffect } from 'react';
import { Wifi, Cpu, Clock, HardDrive, Globe } from 'lucide-react';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="h-7 bg-slate-900 text-slate-400 text-[10px] font-medium flex items-center justify-between px-4 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="uppercase tracking-wider">System: Operational</span>
        </div>
        <div className="h-3 w-px bg-slate-700"></div>
        <div className="flex items-center gap-1.5">
          <Wifi size={10} className="text-emerald-500" />
          <span>latency: 24ms</span>
        </div>
        <div className="h-3 w-px bg-slate-700"></div>
        <div className="flex items-center gap-1.5">
          <Globe size={10} />
          <span>Region: US-EAST-1</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Cpu size={10} />
          <span>Proc: 12%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HardDrive size={10} />
          <span>DB: Syncing</span>
        </div>
        <div className="h-3 w-px bg-slate-700"></div>
        <div className="flex items-center gap-1.5 tabular-nums">
          <Clock size={10} />
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
