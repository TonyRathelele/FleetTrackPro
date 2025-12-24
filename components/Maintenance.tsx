
import React from 'react';
import { Wrench, ShieldCheck, History, Calendar, AlertCircle, DollarSign, Clock } from 'lucide-react';
import { MaintenanceLog, Vehicle } from '../types';

interface MaintenanceProps {
  logs: MaintenanceLog[];
  setLogs: React.Dispatch<React.SetStateAction<MaintenanceLog[]>>;
  vehicles: Vehicle[];
}

const MaintenanceLogs: React.FC<MaintenanceProps> = ({ logs, vehicles }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Maintenance Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Keep your fleet safe and efficient</p>
        </div>
        <button className="bg-slate-800 dark:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
          <Wrench size={18} />
          Create Service Entry
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <History size={18} className="text-blue-500" />
            Service History Timeline
          </h3>
          <div className="space-y-4">
            {logs.map(log => {
              const vehicle = vehicles.find(v => v.id === log.vehicleId);
              return (
                <div key={log.id} className="relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800 last:before:hidden">
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-white dark:border-slate-900 flex items-center justify-center text-blue-600 z-10">
                    <ShieldCheck size={12} />
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{log.type}</h4>
                        <p className="text-xs font-semibold text-blue-600">{vehicle?.registrationNumber} ({vehicle?.id})</p>
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">R{log.cost.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{log.notes}</p>
                    <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Calendar size={14} /> Service: {log.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                        <Clock size={14} /> Next: {log.nextServiceDate}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-500" />
            Pending Inspections
          </h3>
          <div className="space-y-4">
             {vehicles.filter(v => v.status === 'MAINTENANCE').map(v => (
               <div key={v.id} className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-xl">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg">
                      <Wrench size={16} />
                    </div>
                    <h5 className="font-bold text-rose-700 dark:text-rose-400 text-sm">{v.registrationNumber}</h5>
                 </div>
                 <p className="text-xs text-rose-600/80 mb-3">Vehicle is currently in the shop. Service completion expected in 48 hours.</p>
                 <button className="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:underline">Update Status</button>
               </div>
             ))}
             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <DollarSign size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">Maintenance Estimate</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">R14,820</p>
                <p className="text-[10px] text-slate-400 uppercase mt-1">Projected Q2 Spend</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceLogs;
