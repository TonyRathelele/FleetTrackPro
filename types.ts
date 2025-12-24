
export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE'
}

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  ON_ROUTE = 'ON_ROUTE',
  OFF_DUTY = 'OFF_DUTY'
}

export type SAProvince = 'Gauteng' | 'Western Cape' | 'KwaZulu-Natal' | 'Eastern Cape' | 'Free State' | 'Limpopo' | 'Mpumalanga' | 'North West' | 'Northern Cape';

export interface Vehicle {
  id: string;
  type: 'Truck' | 'Van' | 'Car';
  registrationNumber: string;
  province: SAProvince;
  fuelType: 'Diesel' | 'Petrol' | 'Electric';
  mileage: number;
  status: VehicleStatus;
  lastServiceDate?: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedVehicleId?: string;
  status: DriverStatus;
}

export interface Route {
  id: string;
  name: string;
  startLocation: string;
  destination: string;
  distance: number;
  province: SAProvince;
  assignedDriverId?: string;
  assignedVehicleId?: string;
  scheduledDate: string;
}

export interface FuelEntry {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  cost: number;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  cost: number;
  nextServiceDate: string;
  notes: string;
}

export interface Alert {
  id: string;
  type: 'maintenance' | 'license' | 'route' | 'finance';
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  startTime: string;
  endTime?: string;
  revenue: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface WorkOrder {
  id: string;
  vehicleId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}

export interface RevenueRecord {
  id: string;
  date: string;
  amount: number;
  source: string;
  category: 'FREIGHT' | 'LOGISTICS' | 'CONSULTING';
}
