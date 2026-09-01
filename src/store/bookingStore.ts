import { create } from 'zustand';
import { Booking, BookingStatus, BookingPriceDetails } from '../types/booking';
import { MOCK_BOOKINGS } from '../data/mockBookings';
import { Truck } from '../types/truck';

interface BookingState {
  bookings: Booking[];
  liveCoordinates: Record<string, { latitude: number; longitude: number }>; // Indexed by bookingId
  createBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'statusTimeline' | 'paymentStatus'>) => Promise<string>;
  vendorAcceptBooking: (bookingId: string) => Promise<void>;
  vendorRejectBooking: (bookingId: string) => Promise<void>;
  assignDriver: (bookingId: string, driverId: string, driverName: string, driverMobile: string) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: BookingStatus, note?: string) => Promise<void>;
  completePayment: (bookingId: string, method: Booking['paymentMethod']) => Promise<void>;
  submitRating: (bookingId: string, rating: number, review: string) => Promise<void>;
  updateLiveLocation: (bookingId: string, latitude: number, longitude: number) => void;
  getBookingById: (bookingId: string) => Booking | undefined;
  getCustomerBookings: (customerId: string) => Booking[];
  getVendorBookings: (vendorId: string) => Booking[];
  getDriverBookings: (driverId: string) => Booking[];
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: MOCK_BOOKINGS,
  liveCoordinates: {
    'BKM002': { latitude: 13.0223, longitude: 80.1824 } // DLF IT Park area
  },

  createBooking: async (bookingData) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newId = `BKM${String(get().bookings.length + 1).padStart(3, '0')}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      status: 'BOOKING_REQUESTED',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      statusTimeline: [
        {
          status: 'BOOKING_REQUESTED',
          timestamp: new Date().toISOString(),
          note: 'Booking requested by customer.'
        }
      ]
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings]
    }));

    return newId;
  },

  vendorAcceptBooking: async (bookingId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const timestamp = new Date().toISOString();
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'VENDOR_ACCEPTED',
              statusTimeline: [
                ...b.statusTimeline,
                { status: 'VENDOR_ACCEPTED', timestamp, note: 'Vendor accepted booking.' }
              ]
            }
          : b
      )
    }));
  },

  vendorRejectBooking: async (bookingId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const timestamp = new Date().toISOString();
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'CANCELLED',
              statusTimeline: [
                ...b.statusTimeline,
                { status: 'CANCELLED', timestamp, note: 'Vendor rejected booking.' }
              ]
            }
          : b
      )
    }));
  },

  assignDriver: async (bookingId, driverId, driverName, driverMobile) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const timestamp = new Date().toISOString();
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'DRIVER_ASSIGNED',
              driverId,
              driverName,
              driverMobile,
              statusTimeline: [
                ...b.statusTimeline,
                { status: 'DRIVER_ASSIGNED', timestamp, note: `Driver ${driverName} assigned to trip.` }
              ]
            }
          : b
      )
    }));
    // Set initial driver coordinates at pickup point for demo
    get().updateLiveLocation(bookingId, 13.0727, 80.2007); // Mock pickup area Koyambedu
  },

  updateBookingStatus: async (bookingId, status, note) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const timestamp = new Date().toISOString();
    
    // Simulate live locations based on trip status updates
    if (status === 'DRIVER_ASSIGNED') {
      get().updateLiveLocation(bookingId, 13.0727, 80.2007); // initial
    } else if (status === 'DRIVER_REACHED_PICKUP') {
      get().updateLiveLocation(bookingId, 13.0750, 80.2100); // reached pickup
    } else if (status === 'TRUCK_IN_TRANSIT') {
      get().updateLiveLocation(bookingId, 13.0500, 80.2300); // on the way
    } else if (status === 'REACHED_DESTINATION') {
      get().updateLiveLocation(bookingId, 13.0100, 80.2500); // destination
    }

    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status,
              statusTimeline: [
                ...b.statusTimeline,
                { status, timestamp, note: note || `Booking status updated to ${status}.` }
              ]
            }
          : b
      )
    }));
  },

  completePayment: async (bookingId, method) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              paymentMethod: method,
              paymentStatus: 'COMPLETED'
            }
          : b
      )
    }));
  },

  submitRating: async (bookingId, rating, review) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              rating,
              review
            }
          : b
      )
    }));
  },

  updateLiveLocation: (bookingId, latitude, longitude) => {
    set((state) => ({
      liveCoordinates: {
        ...state.liveCoordinates,
        [bookingId]: { latitude, longitude }
      }
    }));
  },

  getBookingById: (bookingId) => {
    return get().bookings.find((b) => b.id === bookingId);
  },

  getCustomerBookings: (customerId) => {
    return get().bookings.filter((b) => b.customerId === customerId);
  },

  getVendorBookings: (vendorId) => {
    // Return bookings where vendor owns the truck associated
    return get().bookings.filter((b) => b.truckDetails.ownerId === vendorId);
  },

  getDriverBookings: (driverId) => {
    return get().bookings.filter((b) => b.driverId === driverId);
  }
}));
