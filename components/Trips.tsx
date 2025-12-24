
import React, { useState } from 'react';
import { History, Plus, Filter, Search, Clock, CheckCircle, Navigation, MoreHorizontal, X } from 'lucide-react';
import { Trip, Vehicle, Driver } from '../types';

interface TripProps {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  vehicles: Vehicle[];
  drivers: Driver[];
}

const Trips: React.FC<TripProps> = ({ trips, setTrips, vehicles, drivers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTrip: Trip = {
      id: `T-00${trips.length + 1}`,
      vehicleId: formData.get('vehicleId') as string,
      driverId: formData.get('driverId') as string,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      startTime: new Date().toISOString(),
      revenue: Number(formData.get('revenue')),
      status: 'PENDING',
    };
    setTrips(prev => [...prev, newTrip]);
    setIsModalOpen(false);
  };

  const completeTrip = (id: string) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, status: 'COMPLETED', endTime: new Date().toISOString() } : t));
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Journey Matrix</h1>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">Live Dispatch & Trip Lifecycle</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-[11px] font-bold shadow-sm"
        >
          <Plus size={14} /> DISPATCH NEW TRIP
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex-1">
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between">
           <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Find Journey..." className="pl-7 pr-3 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-[10px] outline-none" />
           </div>
           <Filter size={14} className="text-slate-400" />
        </div>
        <div className="overflow-auto no-scrollbar h-full pb-10">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3">Trip ID</th>
                <th className="px-6 py-3">Route (From → To)</th>
                <th className="px-6 py-3">Asset / Operator</th>
                <th className="px-6 py-3">Financials</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {trips.map(trip => {
                const v = vehicles.find(vec => vec.id === trip.vehicleId);
                const d = drivers.find(drv => drv.id === trip.driverId);
                return (
                  <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-3 font-mono text-[10px] text-blue-600">{trip.id}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold">
                        <span className="text-slate-800 dark:text-slate-200">{trip.origin}</span>
                        <Navigation size={10} className="rotate-90 text-slate-400" />
                        <span className="text-slate-800 dark:text-slate-200">{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-[10px]">
                        <p className="font-bold text-slate-600 dark:text-slate-400 uppercase">{v?.registrationNumber}</p>
                        <p className="text-slate-400">{d?.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">R{trip.revenue.toLocaleString()}</td>
                    <td className="px-6 py-3">
                       <StatusChip status={trip.status} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      {trip.status !== 'COMPLETED' ? (
                        <button onClick={() => completeTrip(trip.id)} className="text-[9px] font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100">ARRIVE</button>
                      ) : (
                        <button className="p-1 text-slate-300"><MoreHorizontal size={14} /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Dispatch Fleet Asset</h3>
            <form onSubmit={handleAdd} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Origin</label>
                  <input required name="origin" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs" />
                 </div>
                 <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Destination</label>
                  <input required name="destination" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Vehicle</label>
                  <select name="vehicleId" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs">
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
                  </select>
                 </div>
                 <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Driver</label>
                  <select name="driverId" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs">
                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                 </div>
               </div>
               <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Freight Value (R)</label>
                <input required type="number" name="revenue" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs" />
               </div>
               <div className="pt-4 flex gap-2">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[11px] font-bold bg-slate-100 text-slate-600 rounded-md">ABORT</button>
                 <button type="submit" className="flex-1 py-2 text-[11px] font-bold bg-blue-600 text-white rounded-md">INITIATE DISPATCH</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusChip: React.FC<{status: string}> = ({status}) => {
  const styles: any = {
    COMPLETED: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200',
    IN_PROGRESS: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 animate-pulse',
    PENDING: 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200'
  };
  return <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase ${styles[status]}`}>{status}</span>;
}

export default Trips;
