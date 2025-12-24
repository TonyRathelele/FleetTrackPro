
import React, { useState } from 'react';
import { 
  ShieldCheck, Mail, Lock, Building2, ArrowRight, 
  Truck, Eye, EyeOff, CheckCircle2, Target, 
  BarChart3, Zap, Globe, Activity
} from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate enterprise-grade auth sequence
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
      </div>

      {/* Left Side: Brand & Hero Content */}
      <div className="relative flex-1 flex flex-col justify-between p-8 lg:p-20 z-10">
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-xl shadow-blue-500/20">
            FT
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">FleetTrack<span className="text-blue-500">Pro</span></h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Precision Logistics v3.2</p>
          </div>
        </div>

        <div className="max-w-xl space-y-8 my-12 lg:my-0 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-none">
              Command Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Global Fleet.</span>
            </h2>
            <p className="text-slate-400 text-sm lg:text-base font-medium max-w-md leading-relaxed">
              Consolidate telemetry, personnel, and financial records into a single tactical interface. Engineered for modern logistics enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              icon={<Target className="text-blue-400" size={18} />}
              title="Real-time Matrix"
              desc="Sub-second GPS synchronization and active asset tracking."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-emerald-400" size={18} />}
              title="Finance Engine"
              desc="Deep margin analytics and predictive refueling algorithms."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-400" size={18} />}
              title="Active Ops"
              desc="Predictive maintenance logs and automated work order dispatch."
            />
            <FeatureCard 
              icon={<Globe className="text-indigo-400" size={18} />}
              title="Global Scale"
              desc="Multi-region support with cross-provincial logistics nodes."
            />
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-in fade-in duration-1000 delay-500">
           <div className="flex items-center gap-2">
             <Activity size={12} className="text-emerald-500" />
             99.9% Uptime SLA
           </div>
           <div className="flex items-center gap-2">
             <ShieldCheck size={12} className="text-blue-500" />
             ISO-27001 Certified
           </div>
        </div>
      </div>

      {/* Right Side: Auth Interface */}
      <div className="relative w-full lg:w-[500px] bg-white/5 backdrop-blur-3xl border-l border-white/10 flex flex-col justify-center p-8 lg:p-12 z-20 shadow-2xl">
        <div className="max-w-md mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-2xl font-black text-white tracking-tight">Access Control</h3>
            <p className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-widest">Initialization Protocol</p>
          </div>

          {/* Auth Switcher */}
          <div className="flex p-1 bg-slate-900/50 rounded-xl mb-8 border border-white/5">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'register' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enterprise Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                    <input required type="text" placeholder="Global Logistics Corp" className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fleet Deployment</label>
                  <select className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-white">
                    <option>1-20 Active Assets</option>
                    <option>21-100 Operations</option>
                    <option>100+ Enterprise Scale</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                <input required type="email" placeholder="admin@enterprise.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Credentials</label>
                {mode === 'login' && <button type="button" className="text-[9px] font-bold text-blue-400 hover:underline tracking-tighter">Reset Key?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                <input required type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-12 pr-12 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-white" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'login' ? 'INITIALIZE SYSTEM' : 'CREATE ACCOUNT'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-8 flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
               <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
               <p className="text-[10px] font-bold text-emerald-400 leading-tight uppercase tracking-tight">
                 Identity verified across Global Logistics Network. Secure session active.
               </p>
            </div>
          )}
        </div>
        
        <div className="mt-auto pt-12 flex justify-between items-center text-[9px] font-bold text-slate-600 uppercase tracking-widest">
           <span>FleetTrack Core 3.2.0</span>
           <span className="text-slate-400 flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Nodes Syncing
           </span>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-default group">
    <div className="mb-3">{icon}</div>
    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1 group-hover:text-blue-400 transition-colors">{title}</h4>
    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default Login;
