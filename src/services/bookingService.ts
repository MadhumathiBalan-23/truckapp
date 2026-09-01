import { useBookingStore } from '../store/bookingStore';
import { Booking } from '../types/booking';

export const bookingService = {
  createBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'statusTimeline' | 'paymentStatus'>) =>
    useBookingStore.getState().createBooking(bookingData),
  vendorAccept: (bookingId: string) =>
    useBookingStore.getState().vendorAcceptBooking(bookingId),
  vendorReject: (bookingId: string) =>
    useBookingStore.getState().vendorRejectBooking(bookingId),
  assignDriver: (bookingId: string, driverId: string, driverName: string, driverMobile: string) =>
    useBookingStore.getState().assignDriver(bookingId, driverId, driverName, driverMobile),
  getCustomerBookings: (customerId: string) =>
    useBookingStore.getState().getCustomerBookings(customerId),
  getVendorBookings: (vendorId: string) =>
    useBookingStore.getState().getVendorBookings(vendorId),
};
