
import React from 'react';
import { 
  Fuel, 
  TrendingUp, 
  DollarSign, 
  Droplet, 
  Plus, 
  BarChart2,
  Calendar
} from 'lucide-react';
import { FuelEntry, Vehicle } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FuelProps {
  fuelEntries: FuelEntry[];
  setFuelEntries: React.Dispatch<React.SetStateAction<FuelEntry[]>>;
  vehicles: Vehicle[];
}

const FuelManagement: React.FC<FuelProps> = ({ fuelEntries, setFuelEntries, vehicles }) => {
  const totalLiters = fuelEntries.reduce((acc, entry) => acc + entry.liters, 0);
  const totalCost = fuelEntries.reduce((acc, entry) => acc + entry.cost, 0);
  const avgCostPerLiter = totalCost / totalLiters;

  const vehicleSpending = vehicles.map(v => {
    const entries = fuelEntries.filter(e => e.vehicleId === v.id);
    const cost = entries.reduce((acc, e) => acc + e.cost, 0);
    return { name: v.registrationNumber, cost };
  }).filter(v => v.cost > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fuel Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Track consumption and efficiency across the fleet</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95">
          <Plus size={18} />
          <span className="font-semibold text-sm">Log Fuel Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsTile title="Total Fuel Volume" value={`${totalLiters.toLocaleString()} L`} icon={<Droplet className="text-blue-500" />} />
        <StatsTile title="Total Expenditure" value={`R${totalCost.toLocaleString()}`} icon={<DollarSign className="text-emerald-500" />} />
        <StatsTile title="Avg. Price/Liter" value={`R${avgCostPerLiter.toFixed(2)}`} icon={<TrendingUp className="text-amber-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-500" />
            Fuel Spend by Vehicle
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleSpending} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} tickLine={false} axisLine={false} />
                <Tooltip 
                  formatter={(value) => `R${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#fff', fontSize: '10px' }}
                  cursor={{ fill: '#1e293b', opacity: 0.4 }} 
                />
                <Bar dataKey="cost" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Fuel size={18} className="text-emerald-500" />
            Recent Refueling Logs
          </h3>
          <div className="space-y-4">
            {fuelEntries.slice().reverse().map(entry => {
              const vehicle = vehicles.find(v => v.id === entry.vehicleId);
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                      <Fuel size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{vehicle?.registrationNumber}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar size={10} /> {entry.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{entry.liters}L</p>
                    <p className="text-xs font-bold text-emerald-600">R{entry.cost}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsTile: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group hover:border-slate-200 dark:hover:border-slate-600 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5 tabular-nums">{value}</h4>
      </div>
    </div>
  </div>
);

export default FuelManagement;
