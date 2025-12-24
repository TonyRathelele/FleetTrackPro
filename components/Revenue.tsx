
import React, { useState } from 'react';
import { DollarSign, Plus, ArrowUpRight, TrendingUp, Filter, Download, MoreHorizontal, X } from 'lucide-react';
import { RevenueRecord } from '../types';

interface RevenueProps {
  records: RevenueRecord[];
  setRecords: React.Dispatch<React.SetStateAction<RevenueRecord[]>>;
}

const Revenue: React.FC<RevenueProps> = ({ records, setRecords }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalRevenue = records.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord: RevenueRecord = {
      id: `REV-00${records.length + 1}`,
      date: formData.get('date') as string,
      amount: Number(formData.get('amount')),
      source: formData.get('source') as string,
      category: formData.get('category') as any,
    };
    setRecords(prev => [...prev, newRecord]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Archive revenue record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Finance Engine</h1>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">Global Revenue & Margin Tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-md"><Download size={16} /></button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-[11px] font-bold shadow-sm"
          >
            <Plus size={14} /> NEW INVOICE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinanceStat label="Gross Revenue" value={`R${totalRevenue.toLocaleString()}`} trend="+8.4%" icon={<DollarSign size={16} className="text-blue-500" />} />
        <FinanceStat label="Avg Margin" value="32.4%" trend="+1.2%" icon={<ArrowUpRight size={16} className="text-emerald-500" />} />
        <FinanceStat label="Projected Q2" value={`R${(totalRevenue * 1.5).toLocaleString()}`} trend="Stable" icon={<TrendingUp size={16} className="text-amber-500" />} />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select className="bg-transparent border-none text-[11px] font-bold outline-none dark:text-slate-200">
              <option>Filter Category</option>
              <option>Freight</option>
              <option>Logistics</option>
            </select>
          </div>
        </div>
        <div className="overflow-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900">
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Source Client</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-2.5 font-mono text-[10px] text-slate-500">{record.id}</td>
                  <td className="px-6 py-2.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">{record.date}</td>
                  <td className="px-6 py-2.5 text-[11px] text-slate-800 dark:text-slate-200 font-bold">{record.source}</td>
                  <td className="px-6 py-2.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">
                      {record.category}
                    </span>
                  </td>
                  <td className="px-6 py-2.5 text-right font-mono text-[11px] font-bold text-emerald-600 tabular-nums">
                    +R{record.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-2.5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(record.id)} className="p-1 text-slate-400 hover:text-rose-500"><X size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Post Revenue Record</h3>
            <form onSubmit={handleAdd} className="space-y-4">
               <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Client Source</label>
                <input required name="source" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Amount (R)</label>
                  <input required type="number" name="amount" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs" />
                 </div>
                 <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                  <input required type="date" name="date" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs" />
                 </div>
               </div>
               <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                <select name="category" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs">
                  <option value="FREIGHT">Freight</option>
                  <option value="LOGISTICS">Logistics</option>
                </select>
               </div>
               <div className="pt-4 flex gap-2">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[11px] font-bold bg-slate-100 text-slate-600 rounded-md">CANCEL</button>
                 <button type="submit" className="flex-1 py-2 text-[11px] font-bold bg-blue-600 text-white rounded-md">COMMIT RECORD</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FinanceStat: React.FC<{label: string, value: string, trend: string, icon: React.ReactNode}> = ({label, value, trend, icon}) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md">{icon}</div>
    </div>
    <div className="flex items-end justify-between">
      <h4 className="text-lg font-bold text-slate-800 dark:text-white">{value}</h4>
      <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">{trend}</span>
    </div>
  </div>
);

export default Revenue;
