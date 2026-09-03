import { create } from 'zustand';
import { Truck, TruckType } from '../types/truck';
import { MOCK_TRUCKS } from '../data/mockTrucks';

interface TruckState {
  trucks: Truck[];
  registerTruck: (truckData: Omit<Truck, 'id' | 'status' | 'rating' | 'totalTrips'>) => Promise<string>;
  addTruck: (truckData: Omit<Truck, 'id' | 'status' | 'rating' | 'totalTrips'>) => Promise<boolean>;
  updateTruckStatus: (truckId: string, status: 'APPROVED' | 'REJECTED') => Promise<void>;
  updateTruckDriverAvailability: (truckId: string, available: boolean, driverId?: string) => Promise<void>;
  updateTruckDetails: (truckId: string, updates: Partial<Truck>) => Promise<void>;
  getTruckById: (truckId: string) => Truck | undefined;
  getApprovedTrucks: () => Truck[];
  getVendorTrucks: (vendorId: string) => Truck[];
}

export const useTruckStore = create<TruckState>((set, get) => ({
  trucks: MOCK_TRUCKS,

  registerTruck: async (truckData) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newId = `TRK${String(get().trucks.length + 1).padStart(3, '0')}`;
    const newTruck: Truck = {
      ...truckData,
      id: newId,
      status: 'PENDING',
      rating: 0.0,
      totalTrips: 0,
    };

    set((state) => ({
      trucks: [...state.trucks, newTruck],
    }));

    return newId;
  },

  addTruck: async (truckData: any) => {
    const ownerId = truckData.vendorId || truckData.ownerId || 'USR002';
    const id = await get().registerTruck({
      ...truckData,
      ownerId,
      fuelType: truckData.fuelType === 'EV' ? 'Electric' : truckData.fuelType,
      bodyType: truckData.bodyType === 'Container' ? 'Closed Container' : truckData.bodyType === 'Open' ? 'Open Body' : 'Flatbed',
    });
    return !!id;
  },

  updateTruckStatus: async (truckId, status) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      trucks: state.trucks.map((t) => (t.id === truckId ? { ...t, status } : t)),
    }));
  },

  updateTruckDriverAvailability: async (truckId, available, driverId) => {
    set((state) => ({
      trucks: state.trucks.map((t) =>
        t.id === truckId
          ? { ...t, driverAvailable: available, assignedDriverId: driverId || t.assignedDriverId }
          : t
      ),
    }));
  },

  updateTruckDetails: async (truckId, updates) => {
    set((state) => ({
      trucks: state.trucks.map((t) => (t.id === truckId ? { ...t, ...updates } : t)),
    }));
  },

  getTruckById: (truckId) => {
    return get().trucks.find((t) => t.id === truckId);
  },

  getApprovedTrucks: () => {
    return get().trucks.filter((t) => t.status === 'APPROVED');
  },

  getVendorTrucks: (vendorId) => {
    return get().trucks.filter((t) => t.ownerId === vendorId);
  },
}));
