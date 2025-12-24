
import React from 'react';
import { BarChart3, Download, FileText, PieChart, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

interface ReportsProps {
  data: any;
}

const Reports: React.FC<ReportsProps> = ({ data }) => {
  const handleExport = (type: string) => {
    alert(`Generating ${type} report...`);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Business Intelligence</h1>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">Enterprise Logistics Data Analytics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-md text-[10px] font-bold border border-slate-200 dark:border-slate-700">
            <FileText size={12} /> EXPORT PDF
          </button>
          <button onClick={() => handleExport('CSV')} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-md text-[10px] font-bold shadow-sm">
            <Download size={12} /> EXPORT CSV (RAW)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard title="Total Freight Value" value={`R${data.revenueRecords.reduce((a: any, b: any) => a + b.amount, 0).toLocaleString()}`} icon={<TrendingUp size={20} className="text-blue-500" />} color="blue" />
        <ReportCard title="Operational Margin" value="34.2%" icon={<PieChart size={20} className="text-emerald-500" />} color="emerald" />
        <ReportCard title="Fleet Uptime" value="98.5%" icon={<BarChart3 size={20} className="text-indigo-500" />} color="indigo" />
        <ReportCard title="Pending Audits" value="2" icon={<Calendar size={20} className="text-amber-500" />} color="amber" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-6">Generated Modules</h3>
          <div className="space-y-4">
             <ExportItem title="Monthly Maintenance Audit" date="May 20, 2024" size="2.4 MB" />
             <ExportItem title="Quarterly Fuel Efficiency Telemetry" date="Apr 15, 2024" size="1.1 MB" />
             <ExportItem title="Operator Performance Matrix" date="May 01, 2024" size="4.8 MB" />
             <ExportItem title="Regulatory Compliance (License Registry)" date="May 19, 2024" size="0.4 MB" />
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">AI Insights (Experimental)</h3>
          <div className="space-y-6 flex-1">
             <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-[11px] text-blue-400 font-bold mb-1 uppercase tracking-tighter">Cost Optimization</p>
                <p className="text-xs text-slate-300 leading-relaxed">Transitioning Route V001 to Electric Assets would save <span className="text-white font-bold">R12,200/mo</span> in energy costs.</p>
             </div>
             <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-[11px] text-emerald-400 font-bold mb-1 uppercase tracking-tighter">Route Logic</p>
                <p className="text-xs text-slate-300 leading-relaxed">N1 Northbound congestion is increasing. Consider scheduling 05:00 dispatch window.</p>
             </div>
          </div>
          <button className="w-full py-3 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Re-run Analysis Engine</button>
        </div>
      </div>
    </div>
  );
};

const ReportCard: React.FC<{title: string, value: string, icon: React.ReactNode, color: string}> = ({title, value, icon}) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{title}</p>
      {icon}
    </div>
    <h4 className="text-2xl font-bold text-slate-800 dark:text-white tabular-nums">{value}</h4>
  </div>
);

const ExportItem: React.FC<{title: string, date: string, size: string}> = ({title, date, size}) => (
  <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-slate-400 group-hover:text-blue-500"><FileText size={16} /></div>
      <div>
        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{title}</p>
        <p className="text-[9px] text-slate-400">{date} • PDF ARCHIVE</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{size}</span>
      <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-500" />
    </div>
  </div>
);

export default Reports;
