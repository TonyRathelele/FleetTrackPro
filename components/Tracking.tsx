
import React, { useState, useEffect, useRef } from 'react';
import { Map as MapIcon, Navigation, Crosshair, Search, Truck, Info, LocateFixed, Activity, Radio, Layers, MapPin, Building2, Warehouse, Anchor } from 'lucide-react';
import { Vehicle } from '../types';

interface TrackingProps {
  vehicles: Vehicle[];
}

interface AssetPos {
  id: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  history: {x: number, y: number}[];
}

interface LogisticsHub {
  id: string;
  name: string;
  type: 'Warehouse' | 'Depot' | 'Port' | 'Hub';
  lat: number;
  lng: number;
}

const LOGISTICS_HUBS: LogisticsHub[] = [
  { id: 'H1', name: 'OR TAMBO INT AIRPORT', type: 'Hub', lat: -26.1367, lng: 28.2411 },
  { id: 'H2', name: 'CITY DEEP TERMINAL', type: 'Port', lat: -26.2231, lng: 28.1023 },
  { id: 'H3', name: 'MIDRAND DISTRO CENTER', type: 'Warehouse', lat: -25.9992, lng: 28.1262 },
  { id: 'H4', name: 'SANDTON CORPORATE', type: 'Depot', lat: -26.1076, lng: 28.0567 },
  { id: 'H5', name: 'PRETORIA WEST DEPOT', type: 'Warehouse', lat: -25.7505, lng: 28.1364 },
  { id: 'H6', name: 'GERMISTON LOGISTICS', type: 'Hub', lat: -26.2267, lng: 28.1667 },
  { id: 'H7', name: 'KEMPTON CARGO ZONE', type: 'Warehouse', lat: -26.0964, lng: 28.2325 },
  { id: 'H8', name: 'CENTURION GATEWAY', type: 'Depot', lat: -25.8640, lng: 28.1889 },
  { id: 'H9', name: 'SOWETO HUB', type: 'Hub', lat: -26.2485, lng: 27.8540 },
  { id: 'H10', name: 'ROODEPOORT LOGISTICS', type: 'Warehouse', lat: -26.1625, lng: 27.8722 },
];

const Tracking: React.FC<TrackingProps> = ({ vehicles }) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMode, setMapMode] = useState<'radar' | 'streets'>('streets');
  const [assetPositions, setAssetPositions] = useState<AssetPos[]>([]);

  // Fixed Bounds for Gauteng/JHB Area
  const minLat = -26.4;
  const maxLat = -25.9;
  const minLng = 27.8;
  const maxLng = 28.4;

  const getPos = (val: number, min: number, max: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  // Initialize and simulate moving assets
  useEffect(() => {
    const initial = vehicles.map((v) => ({
      id: v.id,
      lat: -26.15 + (Math.random() - 0.5) * 0.2,
      lng: 28.10 + (Math.random() - 0.5) * 0.2,
      heading: Math.floor(Math.random() * 360),
      speed: 60 + Math.random() * 40,
      history: []
    }));
    setAssetPositions(initial);

    const interval = setInterval(() => {
      setAssetPositions(prev => prev.map(pos => {
        const rad = (pos.heading * Math.PI) / 180;
        const moveDist = 0.0015; 
        const newLat = pos.lat + Math.sin(rad) * moveDist;
        const newLng = pos.lng + Math.cos(rad) * moveDist;
        
        const x = getPos(newLng, minLng, maxLng);
        const y = 100 - getPos(newLat, minLat, maxLat);

        const newHistory = [...pos.history, {x, y}].slice(-12);

        return {
          ...pos,
          lat: newLat,
          lng: newLng,
          heading: (pos.heading + (Math.random() - 0.5) * 8) % 360,
          speed: Math.max(0, pos.speed + (Math.random() - 0.5) * 4),
          history: newHistory
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [vehicles]);

  const currentSelectedData = assetPositions.find(p => p.id === selectedAsset);
  const currentVehicle = vehicles.find(v => v.id === selectedAsset);

  // Find nearest hub for selected asset
  const nearestHub = currentSelectedData ? LOGISTICS_HUBS.reduce((prev, curr) => {
    const d1 = Math.sqrt(Math.pow(curr.lat - currentSelectedData.lat, 2) + Math.pow(curr.lng - currentSelectedData.lng, 2));
    const d2 = Math.sqrt(Math.pow(prev.lat - currentSelectedData.lat, 2) + Math.pow(prev.lng - currentSelectedData.lng, 2));
    return d1 < d2 ? curr : prev;
  }) : null;

  const filteredAssets = vehicles.filter(v => 
    v.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHubs = LOGISTICS_HUBS.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Infrastructure Matrix
            <Radio size={16} className="text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter font-mono">
            Logistics Corridor • {LOGISTICS_HUBS.length} Verified Hubs • 0.8ms Latency
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <button 
              onClick={() => setMapMode('streets')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all flex items-center gap-2 ${mapMode === 'streets' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
            >
              <MapIcon size={12} /> Streets
            </button>
            <button 
              onClick={() => setMapMode('radar')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all flex items-center gap-2 ${mapMode === 'radar' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
            >
              <Layers size={12} /> Radar
            </button>
          </div>
          <button 
            onClick={() => alert("Satellite Positioning Synchronized.")}
            className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 rounded-md text-[11px] font-bold shadow-lg"
          >
            <LocateFixed size={14} /> GPS LOCK
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Sidebar Registry */}
        <div className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Assets or Places..." 
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-bold outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* Asset List */}
            <div className="px-3 py-2 bg-slate-100/50 dark:bg-slate-800/30 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              Active Fleet Assets ({filteredAssets.length})
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredAssets.map((v) => {
                const livePos = assetPositions.find(p => p.id === v.id);
                return (
                  <div 
                    key={v.id}
                    onClick={() => setSelectedAsset(v.id)}
                    className={`p-3 cursor-pointer transition-all flex items-center justify-between group ${selectedAsset === v.id ? 'bg-indigo-50 dark:bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-2.5 h-2.5 rounded-full ${v.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        {v.status === 'ACTIVE' && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 font-mono leading-none">{v.registrationNumber}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold mt-1 tracking-tighter">{v.province} LOGISTICS</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-slate-500 font-bold">{livePos ? `${Math.floor(livePos.speed)} KM/H` : '---'}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hub List */}
            <div className="px-3 py-2 bg-slate-100/50 dark:bg-slate-800/30 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-t border-slate-100 dark:border-slate-800">
              Infrastructure Hubs ({filteredHubs.length})
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredHubs.map((h) => (
                <div key={h.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-help transition-colors flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    {h.type === 'Port' ? <Anchor size={12} /> : h.type === 'Warehouse' ? <Warehouse size={12} /> : <Building2 size={12} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase leading-none">{h.name}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{h.type} Facility</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className={`flex-1 rounded-xl relative overflow-hidden flex items-center justify-center border transition-all duration-700 ${mapMode === 'streets' ? 'bg-slate-100 dark:bg-[#0f172a] border-slate-200 dark:border-slate-800' : 'bg-[#050810] border-indigo-900/50 shadow-inner'}`}>
          
          {/* Tactical Roads */}
          {mapMode === 'streets' && (
            <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M50 0 L50 100" stroke="currentColor" strokeWidth="0.8" className="text-slate-400 dark:text-slate-700" fill="none" />
              <path d="M0 50 L100 50" stroke="currentColor" strokeWidth="0.6" className="text-slate-400 dark:text-slate-700" fill="none" />
              <path d="M20 0 L80 100" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-800" fill="none" />
              <path d="M0 80 L100 20" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-800" fill="none" />
              <path d="M30 0 L30 100 M70 0 L70 100" stroke="currentColor" strokeWidth="0.1" className="text-slate-200 dark:text-slate-800" fill="none" />
            </svg>
          )}

          {/* Place Markers (Infrastructure Layer) */}
          {LOGISTICS_HUBS.map(hub => {
             const x = getPos(hub.lng, minLng, maxLng);
             const y = 100 - getPos(hub.lat, minLat, maxLat);
             return (
               <div 
                 key={hub.id} 
                 className="absolute group z-20 flex flex-col items-center pointer-events-none" 
                 style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
               >
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-400/50 border border-slate-300 dark:border-slate-700"></div>
                 <div className="mt-1 px-1.5 py-0.5 bg-slate-200/50 dark:bg-slate-900/40 backdrop-blur-sm rounded-sm border border-slate-300/30 dark:border-white/5 opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   <p className="text-[7px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">{hub.name}</p>
                 </div>
               </div>
             );
          })}

          {/* Radar Sweep Effect */}
          {mapMode === 'radar' && (
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,rgba(99,102,241,0.08)_50%,transparent_100%)]"></div>
            </div>
          )}

          {/* Asset Breadcrumbs */}
          {assetPositions.map(pos => (
            selectedAsset === pos.id && pos.history.map((h, i) => (
              <div 
                key={`${pos.id}-h-${i}`}
                className="absolute w-1 h-1 bg-indigo-500 rounded-full opacity-25"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
              />
            ))
          ))}

          {/* Vehicle Markers */}
          {assetPositions.map((pos) => {
            const v = vehicles.find(vec => vec.id === pos.id);
            if (!v) return null;
            
            const x = getPos(pos.lng, minLng, maxLng);
            const y = 100 - getPos(pos.lat, minLat, maxLat);

            return (
              <div 
                key={pos.id} 
                className={`absolute w-4 h-4 rounded-full shadow-2xl cursor-pointer transition-all z-30 flex items-center justify-center
                  ${selectedAsset === pos.id ? 'bg-indigo-600 ring-4 ring-indigo-500/30 scale-125 z-40' : 'bg-emerald-500 ring-2 ring-white/60 dark:ring-slate-900/60'}
                `}
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => setSelectedAsset(pos.id)}
              >
                 <Navigation size={9} className="text-white fill-white" style={{ transform: `rotate(${pos.heading}deg)` }} />
                 {selectedAsset === pos.id && (
                   <div className="absolute -inset-2 border border-indigo-400/50 rounded-full animate-ping"></div>
                 )}
                 {/* Label on Hover/Selected */}
                 {(selectedAsset === pos.id) && (
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded border border-white/20 whitespace-nowrap shadow-xl">
                      {v.registrationNumber}
                   </div>
                 )}
              </div>
            );
          })}

          {/* Tactical Overlay for Selected Asset */}
          {selectedAsset && currentSelectedData && currentVehicle && (
            <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:top-6 lg:bottom-auto lg:w-80 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none tracking-tight">{currentVehicle.registrationNumber}</h4>
                    <p className="text-[9px] text-indigo-500 font-bold uppercase mt-1 tracking-widest flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></div> SAT-LINK ESTABLISHED
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <TacticalInfo label="CURRENT_COORDS" value={`${currentSelectedData.lat.toFixed(4)}, ${currentSelectedData.lng.toFixed(4)}`} />
                <TacticalInfo label="AIR_SPEED" value={`${Math.floor(currentSelectedData.speed)} KM/H`} />
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-[9px] font-black border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-400 uppercase tracking-widest">Nearest Landmark</span>
                  <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <MapPin size={10} className="text-rose-500" /> {nearestHub?.name || 'EN ROUTE'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-400 uppercase tracking-widest">Vector Heading</span>
                  <span className="text-slate-800 dark:text-slate-200">{Math.floor(currentSelectedData.heading)}° (Magnetic North)</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-400 uppercase tracking-widest">Deployment Region</span>
                  <span className="text-indigo-500 uppercase">{currentVehicle.province} GAUTENG CORE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">Open Comms</button>
                <button className="py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Telemetry</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TacticalInfo: React.FC<{label: string, value: string}> = ({label, value}) => (
  <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl p-2.5">
    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">{label}</p>
    <p className="text-[10px] font-mono text-slate-800 dark:text-slate-200 font-black tabular-nums">{value}</p>
  </div>
);

const X: React.FC<{size?: number, className?: string}> = ({size = 16, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Tracking;
