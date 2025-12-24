
import { Vehicle, Driver, Route, FuelEntry, MaintenanceLog, VehicleStatus, DriverStatus, Alert } from './types';

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'V001', type: 'Truck', registrationNumber: 'KFT 102 GP', province: 'Gauteng', fuelType: 'Diesel', mileage: 45000, status: VehicleStatus.ACTIVE },
  { id: 'V002', type: 'Van', registrationNumber: 'CAA 88210', province: 'Western Cape', fuelType: 'Petrol', mileage: 22000, status: VehicleStatus.ACTIVE },
  { id: 'V003', type: 'Truck', registrationNumber: 'ND 992-001', province: 'KwaZulu-Natal', fuelType: 'Diesel', mileage: 89000, status: VehicleStatus.MAINTENANCE },
  { id: 'V004', type: 'Car', registrationNumber: 'BB 55 YY GP', province: 'Gauteng', fuelType: 'Electric', mileage: 5000, status: VehicleStatus.ACTIVE },
  { id: 'V005', type: 'Van', registrationNumber: 'FST 441 FS', province: 'Free State', fuelType: 'Diesel', mileage: 34000, status: VehicleStatus.INACTIVE },
];

export const INITIAL_DRIVERS: Driver[] = [
  { id: 'D001', name: 'Sipho Zulu', licenseNumber: 'L-882192', licenseExpiry: '2025-12-31', assignedVehicleId: 'V001', status: DriverStatus.ON_ROUTE },
  { id: 'D002', name: 'Thabo Mbeki', licenseNumber: 'L-229102', licenseExpiry: '2024-06-15', assignedVehicleId: 'V002', status: DriverStatus.AVAILABLE },
  { id: 'D003', name: 'Johan van Wyk', licenseNumber: 'L-334910', licenseExpiry: '2026-08-20', status: DriverStatus.AVAILABLE },
  { id: 'D004', name: 'Fatima Seedat', licenseNumber: 'L-110293', licenseExpiry: '2023-11-01', status: DriverStatus.OFF_DUTY },
];

export const INITIAL_ROUTES: Route[] = [
  { id: 'R001', name: 'N1 Northbound', startLocation: 'Johannesburg', destination: 'Pretoria', distance: 60, province: 'Gauteng', assignedDriverId: 'D001', assignedVehicleId: 'V001', scheduledDate: '2024-05-20' },
  { id: 'R002', name: 'Cape Town Central', startLocation: 'Paarl', destination: 'Table View', distance: 55, province: 'Western Cape', scheduledDate: '2024-05-21' },
];

export const INITIAL_FUEL: FuelEntry[] = [
  { id: 'F001', vehicleId: 'V001', date: '2024-05-01', liters: 120, cost: 2880 },
  { id: 'F002', vehicleId: 'V001', date: '2024-05-10', liters: 110, cost: 2640 },
  { id: 'F003', vehicleId: 'V002', date: '2024-05-05', liters: 45, cost: 1080 },
  { id: 'F004', vehicleId: 'V003', date: '2024-04-28', liters: 200, cost: 4800 },
];

export const INITIAL_MAINTENANCE: MaintenanceLog[] = [
  { id: 'M001', vehicleId: 'V003', type: 'Major Service', date: '2024-05-15', cost: 8500, nextServiceDate: '2024-11-15', notes: 'Standard 100k km check-up.' },
  { id: 'M002', vehicleId: 'V001', type: 'Tyre Replacement', date: '2024-03-10', cost: 4200, nextServiceDate: '2024-09-10', notes: 'Routine oil change.' },
];

export const INITIAL_ALERTS: Alert[] = [
  { id: 'A001', type: 'maintenance', message: 'Vehicle V003 is overdue for maintenance', severity: 'high', date: '2024-05-18' },
  { id: 'A002', type: 'license', message: 'Driver Fatima Seedat has an expired license', severity: 'high', date: '2024-05-19' },
  { id: 'A003', type: 'maintenance', message: 'Upcoming service for V001 in 10 days', severity: 'low', date: '2024-05-19' },
];
