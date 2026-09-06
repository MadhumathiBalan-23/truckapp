import { Booking } from '../types/booking';
import { MOCK_TRUCKS } from './mockTrucks';

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BKM001',
    customerId: 'USR001',
    customerName: 'Rajesh Kumar',
    customerMobile: '9876543210',
    truckId: 'TRK001',
    truckDetails: MOCK_TRUCKS[0], // Tata 407
    pickupLocation: 'Koyambedu Metro Station, Chennai',
    dropLocation: 'Gandhipuram, Coimbatore',
    pickupDate: '2026-08-30',
    pickupTime: '08:00 AM',
    truckType: 'Light Truck',
    loadType: 'Industrial Machinery Parts',
    estimatedWeight: '3.5 Tons',
    additionalInstructions: 'Please handle the boxes with care, fragile parts.',
    priceDetails: {
      distance: 500,
      truckCharge: 17500,
      driverCharge: 3000,
      platformFee: 250,
      tax: 1200,
      total: 21950,
    },
    status: 'TRIP_COMPLETED',
    driverId: 'USR003', // Arun Kumar
    driverName: 'Arun Kumar',
    driverMobile: '9876543212',
    paymentMethod: 'UPI',
    paymentStatus: 'COMPLETED',
    rating: 5,
    review: 'Excellent service! Driver was professional and reached the destination on time.',
    createdAt: '2026-08-28T09:00:00Z',
    statusTimeline: [
      { status: 'BOOKING_REQUESTED', timestamp: '2026-08-28T09:00:00Z', note: 'Booking requested by customer.' },
      { status: 'VENDOR_ACCEPTED', timestamp: '2026-08-28T09:30:00Z', note: 'Vendor Balaji Logistics accepted.' },
      { status: 'DRIVER_ASSIGNED', timestamp: '2026-08-28T09:35:00Z', note: 'Arun Kumar assigned as driver.' },
      { status: 'DRIVER_REACHED_PICKUP', timestamp: '2026-08-30T07:45:00Z', note: 'Driver reached pickup point.' },
      { status: 'LOADING_STARTED', timestamp: '2026-08-30T08:15:00Z', note: 'Loading completed and locked.' },
      { status: 'TRUCK_IN_TRANSIT', timestamp: '2026-08-30T08:45:00Z', note: 'Truck in transit towards drop point.' },
      { status: 'REACHED_DESTINATION', timestamp: '2026-08-30T17:15:00Z', note: 'Driver reached Coimbatore.' },
      { status: 'TRIP_COMPLETED', timestamp: '2026-08-30T18:00:00Z', note: 'Unloading done. Trip completed.' }
    ]
  },
  {
    id: 'BKM002',
    customerId: 'USR001',
    customerName: 'Rajesh Kumar',
    customerMobile: '9876543210',
    truckId: 'TRK002',
    truckDetails: MOCK_TRUCKS[1], // Ashok Leyland Dost
    pickupLocation: 'DLF IT Park, Ramapuram, Chennai',
    dropLocation: 'T Nagar Rama Street, Chennai',
    pickupDate: '2026-08-31',
    pickupTime: '10:30 AM',
    truckType: 'Mini Truck',
    loadType: 'Office Furniture Relocation',
    estimatedWeight: '1.2 Tons',
    priceDetails: {
      distance: 10,
      truckCharge: 500,
      driverCharge: 300,
      platformFee: 50,
      tax: 42,
      total: 892,
    },
    status: 'TRUCK_IN_TRANSIT',
    driverId: 'USR003', // Arun Kumar
    driverName: 'Arun Kumar',
    driverMobile: '9876543212',
    paymentMethod: 'CARD',
    paymentStatus: 'COMPLETED',
    createdAt: '2026-08-31T08:00:00Z',
    statusTimeline: [
      { status: 'BOOKING_REQUESTED', timestamp: '2026-08-31T08:00:00Z', note: 'Booking requested by customer.' },
      { status: 'VENDOR_ACCEPTED', timestamp: '2026-08-31T08:15:00Z', note: 'Vendor accepted booking.' },
      { status: 'DRIVER_ASSIGNED', timestamp: '2026-08-31T08:20:00Z', note: 'Suresh Raina assigned.' },
      { status: 'DRIVER_REACHED_PICKUP', timestamp: '2026-08-31T10:10:00Z', note: 'Driver arrived.' },
      { status: 'LOADING_STARTED', timestamp: '2026-08-31T10:35:00Z', note: 'Goods loaded.' },
      { status: 'TRUCK_IN_TRANSIT', timestamp: '2026-08-31T10:55:00Z', note: 'In transit to T Nagar.' }
    ]
  },
  {
    id: 'BKM003',
    customerId: 'USR001',
    customerName: 'Rajesh Kumar',
    customerMobile: '9876543210',
    truckId: 'TRK004',
    truckDetails: MOCK_TRUCKS[3], // Tata Signa Container
    pickupLocation: 'Chennai Port Trust, Chennai',
    dropLocation: 'Whitefield Industrial Area, Bangalore',
    pickupDate: '2026-09-02',
    pickupTime: '06:00 AM',
    truckType: 'Container Truck',
    loadType: 'Electronics Cargo Import',
    estimatedWeight: '15 Tons',
    priceDetails: {
      distance: 350,
      truckCharge: 31500,
      driverCharge: 5000,
      platformFee: 500,
      tax: 2200,
      total: 39200,
    },
    status: 'BOOKING_REQUESTED',
    paymentStatus: 'PENDING',
    createdAt: '2026-08-31T20:15:00Z',
    statusTimeline: [
      { status: 'BOOKING_REQUESTED', timestamp: '2026-08-31T20:15:00Z', note: 'Booking requested by customer.' }
    ]
  },
  {
    id: 'BKM004',
    customerId: 'USR001',
    customerName: 'Rajesh Kumar',
    customerMobile: '9876543210',
    truckId: 'TRK006',
    truckDetails: MOCK_TRUCKS[5], // Trailer Flatbed
    pickupLocation: 'Hyundai Factory, Sriperumbudur',
    dropLocation: 'Port of Ennore, Chennai',
    pickupDate: '2026-09-01',
    pickupTime: '11:00 PM',
    truckType: 'Trailer',
    loadType: 'Steel Sheets Coil',
    estimatedWeight: '25 Tons',
    priceDetails: {
      distance: 60,
      truckCharge: 8000,
      driverCharge: 1500,
      platformFee: 200,
      tax: 600,
      total: 10300,
    },
    status: 'VENDOR_ACCEPTED',
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    createdAt: '2026-08-31T18:00:00Z',
    statusTimeline: [
      { status: 'BOOKING_REQUESTED', timestamp: '2026-08-31T18:00:00Z', note: 'Booking requested by customer.' },
      { status: 'VENDOR_ACCEPTED', timestamp: '2026-08-31T18:45:00Z', note: 'Vendor accepted, waiting for driver assignment.' }
    ]
  }
];
