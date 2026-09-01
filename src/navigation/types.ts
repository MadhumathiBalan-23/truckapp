import { Truck } from '../types/truck';
import { Booking } from '../types/booking';

export type AuthParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type CustomerParamList = {
  CustomerTabs: undefined;
  SearchTrucks: { pickup?: string; drop?: string; date?: string; time?: string } | undefined;
  TruckDetails: { truckId: string };
  BookingForm: { truckId: string; pickupLocation: string; dropLocation: string; date: string; time: string };
  Payment: { bookingId: string };
  LiveTracking: { bookingId: string };
  BookingDetails: { bookingId: string };
};

export type CustomerTabParamList = {
  Home: undefined;
  Bookings: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type VendorParamList = {
  VendorTabs: undefined;
  RegisterTruck: { truckId?: string } | undefined; // support edit/resubmit
  TruckDetails: { truckId: string };
  BookingDetails: { bookingId: string };
};

export type VendorTabParamList = {
  Dashboard: undefined;
  MyTrucks: undefined;
  Bookings: undefined;
  Earnings: undefined;
  Profile: undefined;
};

export type DriverParamList = {
  DriverTabs: undefined;
  ActiveTrip: { bookingId: string };
  BookingDetails: { bookingId: string };
};

export type DriverTabParamList = {
  Dashboard: undefined;
  Trips: undefined;
  History: undefined;
  Profile: undefined;
};

export type AdminParamList = {
  AdminTabs: undefined;
  UserManagement: undefined;
  TruckApprovalDetail: { truckId: string };
  BookingManagementDetail: { bookingId: string };
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Users: undefined;
  Trucks: undefined;
  Bookings: undefined;
  Profile: undefined;
};
