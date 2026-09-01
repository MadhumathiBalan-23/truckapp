import { useBookingStore } from '../store/bookingStore';
import { BookingStatus } from '../types/booking';

export const driverService = {
  getDriverBookings: (driverId: string) =>
    useBookingStore.getState().getDriverBookings(driverId),
    
  updateTripStatus: (bookingId: string, status: BookingStatus, note?: string) =>
    useBookingStore.getState().updateBookingStatus(bookingId, status, note),
    
  simulateMovement: (bookingId: string, progress: number) => {
    // Simulate coordinates starting at pickup Koyambedu (13.0727, 80.2007)
    // going to destination (e.g. 13.0100, 80.2500)
    const latStart = 13.0727;
    const lngStart = 80.2007;
    const latEnd = 13.0100;
    const lngEnd = 80.2500;
    
    const lat = latStart + (latEnd - latStart) * progress;
    const lng = lngStart + (lngEnd - lngStart) * progress;
    
    useBookingStore.getState().updateLiveLocation(bookingId, lat, lng);
  }
};
