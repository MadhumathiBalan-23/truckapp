export type TruckType =
  | 'Mini Truck'
  | 'Light Truck'
  | 'Medium Truck'
  | 'Heavy Truck'
  | 'Container Truck'
  | 'Refrigerated Truck'
  | 'Trailer';

export interface TruckDocuments {
  rcBook?: string;
  insurance?: string;
  pollutionCertificate?: string;
  fitnessCertificate?: string;
  images: string[];
}

export interface Truck {
  id: string;
  ownerId: string; // Vendor user ID
  vendorId?: string;
  truckNumber: string;
  truckType: TruckType;
  brand: string;
  model: string;
  year: number;
  capacity: string; // e.g. "5 Ton"
  fuelType: 'Diesel' | 'CNG' | 'Electric' | 'Petrol';
  bodyType: 'Open Body' | 'Closed Container' | 'Flatbed' | 'Lowboy';
  pricePerKm: number;
  pricePerDay: number;
  currentLocation: string;
  driverAvailable: boolean;
  assignedDriverId?: string; // Driver user ID
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating: number;
  totalTrips: number;
  documents?: TruckDocuments;
}
