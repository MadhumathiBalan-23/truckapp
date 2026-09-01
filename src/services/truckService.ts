import { useTruckStore } from '../store/truckStore';
import { Truck } from '../types/truck';

export const truckService = {
  registerTruck: (truckData: Omit<Truck, 'id' | 'status' | 'rating' | 'totalTrips'>) =>
    useTruckStore.getState().registerTruck(truckData),
  approveTruck: (truckId: string) =>
    useTruckStore.getState().updateTruckStatus(truckId, 'APPROVED'),
  rejectTruck: (truckId: string) =>
    useTruckStore.getState().updateTruckStatus(truckId, 'REJECTED'),
  getVendorTrucks: (vendorId: string) =>
    useTruckStore.getState().getVendorTrucks(vendorId),
  getApprovedTrucks: () =>
    useTruckStore.getState().getApprovedTrucks(),
};
