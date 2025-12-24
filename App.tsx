
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Drivers from './components/Drivers';
import FleetRoutes from './components/Routes';
import FuelManagement from './components/Fuel';
import MaintenanceLogs from './components/Maintenance';
import StatusBar from './components/StatusBar';
import Tracking from './components/Tracking';
import Revenue from './components/Revenue';
import Trips from './components/Trips';
import WorkOrders from './components/WorkOrders';
import Reports from './components/Reports';
import Login from './components/Login';

import { 
  INITIAL_VEHICLES, 
  INITIAL_DRIVERS, 
  INITIAL_ROUTES, 
  INITIAL_FUEL, 
  INITIAL_MAINTENANCE,
  INITIAL_ALERTS
} from './constants';
import { 
  Vehicle, Driver, Route as FleetRoute, FuelEntry, 
  MaintenanceLog, Alert, Trip, WorkOrder, RevenueRecord 
} from './types';

const App: React.FC = () => {
  // Default to true for Dark Theme experience
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [routes, setRoutes] = useState<FleetRoute[]>(INITIAL_ROUTES);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>(INITIAL_FUEL);
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>(INITIAL_MAINTENANCE);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  
  const [trips, setTrips] = useState<Trip[]>([
    { id: 'T-001', vehicleId: 'V001', driverId: 'D001', origin: 'Johannesburg', destination: 'Durban', startTime: '2024-05-20T08:00', revenue: 15450, status: 'IN_PROGRESS' },
    { id: 'T-002', vehicleId: 'V002', driverId: 'D002', origin: 'Cape Town', destination: 'Stellenbosch', startTime: '2024-05-19T10:00', endTime: '2024-05-19T14:30', revenue: 2850, status: 'COMPLETED' }
  ]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { id: 'WO-101', vehicleId: 'V003', priority: 'HIGH', description: 'Brake pad replacement', status: 'IN_PROGRESS', createdAt: '2024-05-18' },
    { id: 'WO-102', vehicleId: 'V001', priority: 'LOW', description: 'Windscreen wiper fluid refill', status: 'OPEN', createdAt: '2024-05-19' }
  ]);
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>([
    { id: 'REV-001', date: '2024-05-01', amount: 85500, source: 'Transnet Logistics', category: 'FREIGHT' },
    { id: 'REV-002', date: '2024-05-05', amount: 12400, source: 'Cape Express', category: 'LOGISTICS' }
  ]);

  const contextValue = useMemo(() => ({
    vehicles, setVehicles,
    drivers, setDrivers,
    routes, setRoutes,
    fuelEntries, setFuelEntries,
    maintenance, setMaintenance,
    trips, setTrips,
    workOrders, setWorkOrders,
    revenueRecords, setRevenueRecords,
    alerts,
    darkMode, setDarkMode
  }), [vehicles, drivers, routes, fuelEntries, maintenance, trips, workOrders, revenueRecords, alerts, darkMode]);

  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Login onLogin={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <HashRouter>
      <div className={`${darkMode ? 'dark' : ''} h-screen flex flex-col transition-colors duration-300 overflow-hidden`}>
        <div className="flex flex-1 w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <TopBar 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              onLogout={() => setIsAuthenticated(false)} 
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar bg-slate-50 dark:bg-slate-950">
              <div className="max-w-[1600px] mx-auto h-full">
                <Routes>
                  <Route path="/" element={<Dashboard data={contextValue} />} />
                  <Route path="/vehicles" element={<Vehicles vehicles={vehicles} setVehicles={setVehicles} />} />
                  <Route path="/drivers" element={<Drivers drivers={drivers} setDrivers={setDrivers} vehicles={vehicles} />} />
                  <Route path="/routes" element={<FleetRoutes routes={routes} setRoutes={setRoutes} vehicles={vehicles} drivers={drivers} />} />
                  <Route path="/tracking" element={<Tracking vehicles={vehicles} />} />
                  <Route path="/revenue" element={<Revenue records={revenueRecords} setRecords={setRevenueRecords} />} />
                  <Route path="/trips" element={<Trips trips={trips} setTrips={setTrips} vehicles={vehicles} drivers={drivers} />} />
                  <Route path="/work-orders" element={<WorkOrders orders={workOrders} setOrders={setWorkOrders} vehicles={vehicles} />} />
                  <Route path="/fuel" element={<FuelManagement fuelEntries={fuelEntries} setFuelEntries={setFuelEntries} vehicles={vehicles} />} />
                  <Route path="/maintenance" element={<MaintenanceLogs logs={maintenance} setLogs={setMaintenance} vehicles={vehicles} />} />
                  <Route path="/reports" element={<Reports data={contextValue} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        <StatusBar />
      </div>
    </HashRouter>
  );
};

export default App;
