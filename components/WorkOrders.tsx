
import React, { useState } from 'react';
// Fix: Added Truck to the imported icons from lucide-react
import { ClipboardList, Plus, AlertCircle, CheckCircle, Clock, MoreVertical, Search, X, Truck } from 'lucide-react';
import { WorkOrder, Vehicle } from '../types';

interface WorkOrderProps {
  orders: WorkOrder[];
  setOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  vehicles: Vehicle[];
}

const WorkOrders: React.FC<WorkOrderProps> = ({ orders, setOrders, vehicles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOrder: WorkOrder = {
      id: `WO-${100 + orders.length + 1}`,
      vehicleId: formData.get('vehicleId') as string,
      priority: formData.get('priority') as any,
      description: formData.get('description') as string,
      status: 'OPEN',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrders(prev => [...prev, newOrder]);
    setIsModalOpen(false);
  };

  const updateStatus = (id: string, status: 'IN_PROGRESS' | 'RESOLVED') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Ops Center</h1>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">Maintenance & Service Lifecycle</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 rounded-md text-[11px] font-bold shadow-sm"
        >
          <Plus size={14} /> NEW WORK ORDER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Status Columns */}
        <StatusColumn title="OPEN / BACKLOG" status="OPEN" orders={orders} updateStatus={updateStatus} vehicles={vehicles} />
        <StatusColumn title="IN PROGRESS" status="IN_PROGRESS" orders={orders} updateStatus={updateStatus} vehicles={vehicles} />
        <StatusColumn title="RESOLVED" status="RESOLVED" orders={orders} updateStatus={updateStatus} vehicles={vehicles} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Create Maintenance Task</h3>
            <form onSubmit={handleCreate} className="space-y-4">
               <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Assigned Asset</label>
                <select name="vehicleId" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs">
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} ({v.id})</option>)}
                </select>
               </div>
               <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Task Priority</label>
                <select name="priority" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
               </div>
               <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Work Description</label>
                <textarea name="description" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs h-24" placeholder="Describe fault or requirement..."></textarea>
               </div>
               <div className="pt-4 flex gap-2">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[11px] font-bold bg-slate-100 text-slate-600 rounded-md">CANCEL</button>
                 <button type="submit" className="flex-1 py-2 text-[11px] font-bold bg-blue-600 text-white rounded-md">CREATE TICKET</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusColumn: React.FC<{title: string, status: string, orders: WorkOrder[], updateStatus: any, vehicles: Vehicle[]}> = ({title, status, orders, updateStatus, vehicles}) => {
  const filtered = orders.filter(o => o.status === status);
  return (
    <div className="flex flex-col space-y-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
        <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500">{filtered.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {filtered.map(order => {
          const v = vehicles.find(vec => vec.id === order.vehicleId);
          return (
            <div key={order.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm hover:border-blue-500 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 font-mono">{order.id}</span>
                <PriorityBadge priority={order.priority} />
              </div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-2 leading-snug">{order.description}</p>
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400"><Truck size={10} /></div>
                 <span className="text-[10px] font-bold text-slate-500">{v?.registrationNumber}</span>
              </div>
              <div className="flex gap-1">
                {status === 'OPEN' && (
                  <button onClick={() => updateStatus(order.id, 'IN_PROGRESS')} className="flex-1 py-1 text-[9px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded">IN PROGRESS</button>
                )}
                {status === 'IN_PROGRESS' && (
                  <button onClick={() => updateStatus(order.id, 'RESOLVED')} className="flex-1 py-1 text-[9px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded">RESOLVED</button>
                )}
                <button className="p-1 text-slate-300"><MoreVertical size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PriorityBadge: React.FC<{priority: string}> = ({priority}) => {
  const styles: any = {
    CRITICAL: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
    HIGH: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    MEDIUM: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    LOW: 'text-slate-500 bg-slate-50 dark:bg-slate-800'
  };
  return <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${styles[priority]}`}>{priority}</span>;
}

export default WorkOrders;
