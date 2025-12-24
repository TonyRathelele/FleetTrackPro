
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell 
} from 'recharts';
import { 
  Truck, 
  Activity, 
  AlertTriangle, 
  DollarSign,
  TrendingUp,
  Clock,
  Map as MapIcon,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { VehicleStatus } from '../types';

interface DashboardProps {
  data: any;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { vehicles, fuelEntries, alerts, darkMode } = data;

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v: any) => v.status === VehicleStatus.ACTIVE).length;
  const maintenanceVehicles = vehicles.filter((v: any) => v.status === VehicleStatus.MAINTENANCE).length;
  const totalFuelCost = fuelEntries.reduce((acc: number, entry: any) => acc + entry.cost, 0);

  const fuelTrendData = [
    { month: 'Jan', cost: 12000 },
    { month: 'Feb', cost: 19500 },
    { month: 'Mar', cost: 15200 },
    { month: 'Apr', cost: 21800 },
    { month: 'May', cost: totalFuelCost },
  ];

  const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
  const labelColor = darkMode ? '#64748b' : '#94a3b8';

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Control Center
            <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded tracking-tighter uppercase">v3.2.0-STABLE</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Global logistics telemetry and asset health</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <RefreshCw size={12} /> Sync
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile title="FLEET ASSETS" value={totalVehicles} icon={<Truck size={14} />} trend="+4.2%" trendUp={true} color="blue" />
        <KpiTile title="UTILIZATION" value={`${((activeVehicles/totalVehicles)*100).toFixed(1)}%`} icon={<Activity size={14} />} trend="+1.5%" trendUp={true} color="emerald" />
        <KpiTile title="INCIDENTS" value={maintenanceVehicles} icon={<AlertTriangle size={14} />} trend="-2" trendUp={true} color="rose" />
        <KpiTile title="OPEX (MAY)" value={`R${totalFuelCost.toLocaleString()}`} icon={<DollarSign size={14} />} trend="+12.1%" trendUp={false} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Main Telemetry Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-500" />
              Operational Spend Telemetry
            </h3>
            <div className="flex gap-1">
              {['7D', '30D', '90D'].map(t => (
                <button key={t} className={`px-2 py-0.5 text-[10px] font-bold rounded ${t === '30D' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelTrendData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="month" stroke={labelColor} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={labelColor} fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R${val}`} />
                <Tooltip 
                  formatter={(value) => `R${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#fff', borderRadius: '8px', border: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0', color: darkMode ? '#fff' : '#000', fontSize: '10px' }} 
                />
                <Area type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#chartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Live Tracking Placeholder */}
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden group">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <MapIcon size={14} className="text-indigo-500" />
              Live Asset Matrix
            </h3>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> LIVE
            </span>
          </div>
          <div className="flex-1 relative flex items-center justify-center bg-slate-200 dark:bg-slate-800">
            {/* Styled Map Skeleton */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] dark:opacity-40"></div>
            <div className="z-10 flex flex-col items-center">
              <MapIcon size={40} className="text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center px-4">Awaiting GPS Handshake</p>
            </div>
            {/* Asset markers */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full shadow-lg cursor-pointer hover:scale-150 transition-all"></div>
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-lg cursor-pointer hover:scale-150 transition-all"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Alerts Center */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
             <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Alert Log</h3>
             <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Archive All</button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {alerts.slice(0, 4).map((alert: any) => (
              <div key={alert.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-center gap-4 group">
                <div className={`w-1 h-8 rounded-full ${alert.severity === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{alert.message}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{alert.date} • System Event ID: EV-{alert.id}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
           <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-6">Asset Distribution</h3>
           <div className="space-y-5">
              <ProgressBar label="Active Routes" value={82} color="blue" />
              <ProgressBar label="Maintenance Backlog" value={14} color="rose" />
              <ProgressBar label="Fuel Efficiency" value={65} color="emerald" />
              <ProgressBar label="Schedule Compliance" value={91} color="indigo" />
           </div>
        </div>
      </div>
    </div>
  );
};

const KpiTile: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend: string; trendUp: boolean; color: string }> = ({ title, value, icon, trend, trendUp, color }) => {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-800/50',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-800/50',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 border-rose-200/50 dark:border-rose-800/50',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-800/50'
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:border-slate-700 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{title}</span>
        <div className={`p-1.5 rounded-md ${colorMap[color]}`}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <h4 className="text-xl font-bold text-slate-800 dark:text-white tabular-nums">{value}</h4>
        <span className={`text-[10px] font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const colors: any = {
    blue: 'bg-blue-500',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500'
  };
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-bold">
        <span className="text-slate-500 dark:text-slate-400 uppercase tracking-tight">{label}</span>
        <span className="text-slate-800 dark:text-slate-200 tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} transition-all duration-1000`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
};

export default Dashboard;
