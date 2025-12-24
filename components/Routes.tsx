
import React, { useState } from 'react';
import { 
  MapPin, ArrowRight, Calendar, User, Truck, Plus, 
  CheckCircle2, Clock, X, LayoutGrid, List, AlertCircle, 
  Navigation, Filter, Search, Download, ChevronRight
} from 'lucide-react';
import { Route, Vehicle, Driver, SAProvince } from '../types';

interface RoutesProps {
  routes: Route[];
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  vehicles: Vehicle[];
  drivers: Driver[];
}

const PROVINCES: SAProvince[] = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 
  'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
];

const FleetRoutes: React.FC<RoutesProps> = ({ routes, setRoutes, vehicles, drivers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoutes = routes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRoute: Route = {
      id: `R00${routes.length + 1}`,
      name: formData.get('name') as string,
      startLocation: formData.get('startLocation') as string,
      destination: formData.get('destination') as string,
      distance: Number(formData.get('distance')),
      province: formData.get('province') as SAProvince,
      assignedDriverId: formData.get('driverId') as string,
      assignedVehicleId: formData.get('vehicleId') as string,
      scheduledDate: formData.get('scheduledDate') as string,
    };
    
    setRoutes(prev => [...prev, newRoute]);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
            <Navigation size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Dispatch Scheduler</h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">Route Matrix • {routes.length} Assignments Active</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700">
             <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
             >
                <List size={14} />
             </button>
             <button 
                onClick={() => setViewMode('calendar')}
                className={`p-1.5 rounded transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
             >
                <Calendar size={14} />
             </button>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all shadow-sm text-xs font-bold"
          >
            <Plus size={14} /> NEW ASSIGNMENT
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logistics path..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-bold px-3 py-1.5 outline-none">
            <option>All Provinces</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-800">
          <Download size={14} />
        </button>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 gap-3 overflow-y-auto h-full pr-1 no-scrollbar">
            {filteredRoutes.map((route) => {
              const driver = drivers.find(d => d.id === route.assignedDriverId);
              const vehicle = vehicles.find(v => v.id === route.assignedVehicleId);
              const isUnassigned = !driver || !vehicle;
              
              return (
                <div key={route.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Path Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase rounded border border-indigo-100 dark:border-indigo-800/50 tracking-widest">
                          {route.province}
                        </span>
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{route.name}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Origin</span>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{route.startLocation}</span>
                        </div>
                        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 relative">
                          <Navigation size={10} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 rotate-90" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Destination</span>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{route.destination}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Stats */}
                    <div className="flex items-center gap-8 px-8 border-l border-r border-slate-100 dark:border-slate-800">
                      <div className="text-center">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Distance</p>
                        <p className="text-xs font-black text-slate-700 dark:text-slate-200 tabular-nums">{route.distance} <span className="text-[9px]">KM</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Est. Fuel</p>
                        <p className="text-xs font-black text-indigo-600 tabular-nums">{Math.floor(route.distance * 0.15)} <span className="text-[9px]">L</span></p>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          <div className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold ${driver ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                            {driver ? driver.name.charAt(0) : '?'}
                          </div>
                          <div className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold ${vehicle ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                            {vehicle ? <Truck size={12} /> : '?'}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-none">{driver?.name || 'Unassigned Operator'}</p>
                          <p className="text-[9px] text-slate-400 font-medium mt-1">{vehicle?.registrationNumber || 'Awaiting Asset'}</p>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <Calendar size={12} />
                          {route.scheduledDate}
                        </div>
                        {isUnassigned ? (
                          <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-800 uppercase animate-pulse">
                            <AlertCircle size={10} /> Logic Error: Unassigned
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[8px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800 uppercase">
                            <CheckCircle2 size={10} /> Confirmed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Calendar View Mockup */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-full flex flex-col p-6 items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/50 opacity-10 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]"></div>
             <Calendar size={48} className="text-slate-200 dark:text-slate-800 mb-4 group-hover:scale-110 transition-transform" />
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Temporal Timeline Projection</h3>
             <p className="text-[11px] text-slate-400 mt-2 max-w-xs text-center leading-relaxed">The Calendar module is synchronizing with the central dispatch clock. Real-time scheduling available in next node update.</p>
             <button onClick={() => setViewMode('list')} className="mt-6 text-[10px] font-bold text-indigo-600 hover:underline">Return to List View</button>
          </div>
        )}
      </div>

      {/* Modal Integration */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">Schedule New Route</h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1.5">Logistics Planning Interface</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Route Identifier / Name</label>
                <input 
                  required 
                  name="name" 
                  placeholder="e.g. N1 Northbound Express"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none dark:text-slate-200 transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Origin</label>
                  <input required name="startLocation" placeholder="Start City" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Destination</label>
                  <input required name="destination" placeholder="End City" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Province</label>
                  <select name="province" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Distance (KM)</label>
                  <input required type="number" name="distance" placeholder="0" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Date</label>
                  <input required type="date" name="scheduledDate" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Operator (Driver)</label>
                  <select name="driverId" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold outline-none">
                    <option value="">Awaiting Selection</option>
                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Asset (Vehicle)</label>
                  <select name="vehicleId" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold outline-none">
                    <option value="">Awaiting Selection</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100 dark:border-slate-700">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all uppercase tracking-widest"
                >
                  Assign Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetRoutes;
