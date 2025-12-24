
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, Truck, X, Zap, Droplet, Download, LayoutGrid, List
} from 'lucide-react';
import { Vehicle, VehicleStatus, SAProvince } from '../types';

interface VehiclesProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

const PROVINCES: SAProvince[] = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];

const Vehicles: React.FC<VehiclesProps> = ({ vehicles, setVehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(v => 
    (v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
     v.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || v.status === filterStatus)
  );

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete asset from inventory?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const vehicleData: Vehicle = {
      id: editingVehicle?.id || `V00${vehicles.length + 1}`,
      type: formData.get('type') as any,
      registrationNumber: formData.get('registrationNumber') as string,
      province: formData.get('province') as SAProvince,
      fuelType: formData.get('fuelType') as any,
      mileage: Number(formData.get('mileage')),
      status: formData.get('status') as VehicleStatus,
    };

    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? vehicleData : v));
    } else {
      setVehicles(prev => [...prev, vehicleData]);
    }
    
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
            <Truck size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Asset Inventory</h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">Fleet Registry • {vehicles.length} Active Nodes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-md transition-all">
            <Download size={16} />
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button 
            onClick={() => { setEditingVehicle(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all shadow-sm text-xs font-bold"
          >
            <Plus size={14} /> REGISTER ASSET
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find asset..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 pl-8 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 transition-all"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-bold px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200"
            >
              <option value="all">Status: All</option>
              <option value={VehicleStatus.ACTIVE}>Active</option>
              <option value={VehicleStatus.MAINTENANCE}>Under Repair</option>
              <option value={VehicleStatus.INACTIVE}>Off-Duty</option>
            </select>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700">
             <button className="p-1.5 bg-white dark:bg-slate-700 rounded shadow-sm text-blue-600"><List size={12} /></button>
             <button className="p-1.5 text-slate-400"><LayoutGrid size={12} /></button>
          </div>
        </div>

        <div className="overflow-auto flex-1 no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
              <tr className="text-slate-400 text-[9px] font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3">Asset Hash / Type</th>
                <th className="px-5 py-3">Registration & Province</th>
                <th className="px-5 py-3">Telemetry Data</th>
                <th className="px-5 py-3">System Health</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Truck size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono tracking-tight uppercase">{vehicle.id}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{vehicle.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 w-fit">{vehicle.registrationNumber}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">{vehicle.province}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        {vehicle.fuelType === 'Electric' ? <Zap size={10} className="text-yellow-500" /> : <Droplet size={10} className="text-blue-400" />}
                        {vehicle.fuelType}
                      </div>
                      <div className="h-3 w-px bg-slate-200 dark:bg-slate-800"></div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">{vehicle.mileage.toLocaleString()} <span className="text-slate-400 text-[9px]">KM</span></p>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <SoftwareBadge status={vehicle.status} />
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingVehicle(vehicle); setIsModalOpen(true); }} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 rounded text-slate-400 hover:text-blue-600"><Edit2 size={12} /></button>
                      <button onClick={() => handleDelete(vehicle.id)} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 rounded text-slate-400 hover:text-rose-600"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">
                  {editingVehicle ? 'Modify Asset Data' : 'Asset Registration'}
                </h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1.5">Fleet Core Interface</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingVehicle(null); }} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Registration Number</label>
                  <input 
                    required 
                    name="registrationNumber" 
                    placeholder="e.g. ABC 123 GP"
                    defaultValue={editingVehicle?.registrationNumber} 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Province of Registry</label>
                  <select 
                    name="province" 
                    defaultValue={editingVehicle?.province || 'Gauteng'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 transition-all"
                  >
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Asset Class</label>
                  <select 
                    name="type" 
                    defaultValue={editingVehicle?.type || 'Truck'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 transition-all"
                  >
                    <option value="Truck">Heavy Truck</option>
                    <option value="Van">Delivery Van</option>
                    <option value="Car">Support Vehicle</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Power Source</label>
                  <select 
                    name="fuelType" 
                    defaultValue={editingVehicle?.fuelType || 'Diesel'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 transition-all"
                  >
                    <option value="Diesel">Diesel Engine</option>
                    <option value="Petrol">Petrol Engine</option>
                    <option value="Electric">Electric Drive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Current Odometer (KM)</label>
                  <input 
                    required 
                    type="number"
                    name="mileage" 
                    placeholder="0"
                    defaultValue={editingVehicle?.mileage} 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Deployment Status</label>
                  <select 
                    name="status" 
                    defaultValue={editingVehicle?.status || VehicleStatus.ACTIVE}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 transition-all"
                  >
                    <option value={VehicleStatus.ACTIVE}>Active Operations</option>
                    <option value={VehicleStatus.MAINTENANCE}>Maintenance / Repair</option>
                    <option value={VehicleStatus.INACTIVE}>Off-Duty / Storage</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100 dark:border-slate-700">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); setEditingVehicle(null); }}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest"
                >
                  {editingVehicle ? 'Update Asset' : 'Commit Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SoftwareBadge: React.FC<{ status: VehicleStatus }> = ({ status }) => {
  const styles = {
    [VehicleStatus.ACTIVE]: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/50',
    [VehicleStatus.MAINTENANCE]: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200/50',
    [VehicleStatus.INACTIVE]: 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200/50',
  };
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Vehicles;
