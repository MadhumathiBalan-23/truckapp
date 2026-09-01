import { Truck, TruckType } from './truck';

export type BookingStatus =
  | 'BOOKING_REQUESTED'
  | 'VENDOR_ACCEPTED'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_REACHED_PICKUP'
  | 'LOADING_STARTED'
  | 'TRUCK_IN_TRANSIT'
  | 'REACHED_DESTINATION'
  | 'TRIP_COMPLETED'
  | 'CANCELLED';

export interface BookingPriceDetails {
  distance: number;
  truckCharge: number;
  driverCharge: number;
  platformFee: number;
  tax: number;
  total: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  truckId: string;
  truckDetails: Truck;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  truckType: TruckType;
  loadType: string;
  estimatedWeight: string;
  additionalInstructions?: string;
  priceDetails: BookingPriceDetails;
  status: BookingStatus;
  driverId?: string;
  driverName?: string;
  driverMobile?: string;
  paymentMethod?: 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  rating?: number;
  review?: string;
  createdAt: string;
  statusTimeline: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
}
