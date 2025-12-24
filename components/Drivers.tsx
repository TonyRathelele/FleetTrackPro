
import React, { useState } from 'react';
import { UserSquare2, Search, Plus, Calendar, CreditCard, Car, ExternalLink, X } from 'lucide-react';
import { Driver, DriverStatus, Vehicle } from '../types';

interface DriversProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  vehicles: Vehicle[];
}

const Drivers: React.FC<DriversProps> = ({ drivers, setDrivers, vehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDriver: Driver = {
      id: editingDriver?.id || `D00${drivers.length + 1}`,
      name: formData.get('name') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      licenseExpiry: formData.get('licenseExpiry') as string,
      assignedVehicleId: formData.get('vehicleId') as string || undefined,
      status: formData.get('status') as DriverStatus,
    };

    if (editingDriver) {
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? newDriver : d));
    } else {
      setDrivers(prev => [...prev, newDriver]);
    }
    setIsModalOpen(false);
    setEditingDriver(null);
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fleet Personnel</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage active drivers and licensing</p>
        </div>
        <button 
          onClick={() => { setEditingDriver(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg"
        >
          <Plus size={18} />
          <span className="font-semibold text-sm">Onboard Driver</span>
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search drivers by name or license..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => {
          const vehicle = vehicles.find(v => v.id === driver.assignedVehicleId);
          const expired = isExpired(driver.licenseExpiry);

          return (
            <div key={driver.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700">
                    <UserSquare2 size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{driver.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      driver.status === DriverStatus.AVAILABLE ? 'bg-green-50 text-green-600' :
                      driver.status === DriverStatus.ON_ROUTE ? 'bg-blue-50 text-blue-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {driver.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => { setEditingDriver(driver); setIsModalOpen(true); }}
                  className="p-1.5 text-slate-300 hover:text-blue-500 transition-colors"
                >
                  <ExternalLink size={18} />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <CreditCard size={16} className="text-slate-400" />
                  <span className="font-mono">{driver.licenseNumber}</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${expired ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}`}>
                  <Calendar size={16} className={expired ? 'text-rose-400' : 'text-slate-400'} />
                  <span className="font-medium">Expires: {driver.licenseExpiry}</span>
                  {expired && <span className="text-[10px] bg-rose-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">EXPIRED</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Car size={16} className="text-slate-400" />
                  {vehicle ? (
                    <span className="font-medium text-blue-600 dark:text-blue-400">{vehicle.registrationNumber} ({vehicle.type})</span>
                  ) : (
                    <span className="text-slate-400 italic">No assigned vehicle</span>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                   onClick={() => { setEditingDriver(driver); setIsModalOpen(true); }}
                  className="flex-1 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  Edit Profile
                </button>
                <button className="flex-1 py-2 text-xs font-bold bg-blue-600/10 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                  View Logs
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editingDriver ? 'Edit Driver' : 'Onboard Driver'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input required name="name" defaultValue={editingDriver?.name} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">License Number</label>
                  <input required name="licenseNumber" defaultValue={editingDriver?.licenseNumber} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Expiry Date</label>
                  <input required type="date" name="licenseExpiry" defaultValue={editingDriver?.licenseExpiry} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select name="status" defaultValue={editingDriver?.status || DriverStatus.AVAILABLE} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200">
                    <option value={DriverStatus.AVAILABLE}>Available</option>
                    <option value={DriverStatus.ON_ROUTE}>On Route</option>
                    <option value={DriverStatus.OFF_DUTY}>Off Duty</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Assigned Vehicle</label>
                  <select name="vehicleId" defaultValue={editingDriver?.assignedVehicleId || ''} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200">
                    <option value="">No Vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg">
                  {editingDriver ? 'Update Profile' : 'Complete Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
