import { Truck } from '../types/truck';

export const MOCK_TRUCKS: Truck[] = [
  {
    id: 'TRK001',
    ownerId: 'USR002',
    truckNumber: 'TN 38 AB 1234',
    truckType: 'Light Truck',
    brand: 'Tata',
    model: 'Tata 407',
    year: 2022,
    capacity: '5 Ton',
    fuelType: 'Diesel',
    bodyType: 'Open Body',
    pricePerKm: 35,
    pricePerDay: 2500,
    currentLocation: 'Koyambedu, Chennai',
    driverAvailable: true,
    assignedDriverId: 'USR003', // Arun Kumar
    status: 'APPROVED',
    rating: 4.7,
    totalTrips: 48,
    documents: {
      rcBook: 'RC_TRK001.pdf',
      insurance: 'INS_TRK001.pdf',
      pollutionCertificate: 'PUC_TRK001.pdf',
      fitnessCertificate: 'FIT_TRK001.pdf',
      images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800']
    }
  },
  {
    id: 'TRK002',
    ownerId: 'USR002',
    truckNumber: 'TN 33 CD 5678',
    truckType: 'Mini Truck',
    brand: 'Ashok Leyland',
    model: 'Leyland Dost',
    year: 2023,
    capacity: '2 Ton',
    fuelType: 'Diesel',
    bodyType: 'Open Body',
    pricePerKm: 20,
    pricePerDay: 1500,
    currentLocation: 'Guindy, Chennai',
    driverAvailable: true,
    assignedDriverId: 'DRV002', // Suresh Raina
    status: 'APPROVED',
    rating: 4.8,
    totalTrips: 112,
    documents: {
      rcBook: 'RC_TRK002.pdf',
      insurance: 'INS_TRK002.pdf',
      images: ['https://images.unsplash.com/photo-1516576880881-140175b03209?auto=format&fit=crop&q=80&w=800']
    }
  },
  {
    id: 'TRK003',
    ownerId: 'USR002',
    truckNumber: 'TN 37 EF 9876',
    truckType: 'Heavy Truck',
    brand: 'BharatBenz',
    model: 'BharatBenz 2823C',
    year: 2021,
    capacity: '20 Ton',
    fuelType: 'Diesel',
    bodyType: 'Open Body',
    pricePerKm: 75,
    pricePerDay: 6000,
    currentLocation: 'Tambaram, Chennai',
    driverAvailable: false,
    status: 'APPROVED',
    rating: 4.6,
    totalTrips: 34,
    documents: {
      rcBook: 'RC_TRK003.pdf',
      insurance: 'INS_TRK003.pdf',
      images: ['https://images.unsplash.com/photo-1592838064575-70ed626d3a44?auto=format&fit=crop&q=80&w=800']
    }
  },
  {
    id: 'TRK004',
    ownerId: 'USR002',
    truckNumber: 'TN 02 XY 4321',
    truckType: 'Container Truck',
    brand: 'Tata',
    model: 'Tata Signa 4825.T',
    year: 2023,
    capacity: '32 Ton',
    fuelType: 'Diesel',
    bodyType: 'Closed Container',
    pricePerKm: 90,
    pricePerDay: 8000,
    currentLocation: 'Chennai Port, Chennai',
    driverAvailable: true,
    assignedDriverId: 'DRV003', // Manoj Tiwari
    status: 'APPROVED',
    rating: 4.9,
    totalTrips: 27,
    documents: {
      rcBook: 'RC_TRK004.pdf',
      insurance: 'INS_TRK004.pdf',
      images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800']
    }
  },
  {
    id: 'TRK005',
    ownerId: 'USR002',
    truckNumber: 'TN 10 AA 9999',
    truckType: 'Refrigerated Truck',
    brand: 'Eicher',
    model: 'Eicher Pro 3015',
    year: 2022,
    capacity: '10 Ton',
    fuelType: 'Diesel',
    bodyType: 'Closed Container',
    pricePerKm: 55,
    pricePerDay: 4500,
    currentLocation: 'Ambattur, Chennai',
    driverAvailable: true,
    status: 'APPROVED',
    rating: 4.5,
    totalTrips: 60,
    documents: {
      rcBook: 'RC_TRK005.pdf',
      insurance: 'INS_TRK005.pdf',
      images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800']
    }
  },
  {
    id: 'TRK006',
    ownerId: 'USR002',
    truckNumber: 'TN 66 MM 8888',
    truckType: 'Trailer',
    brand: 'Tata',
    model: 'Tata Prima 5530.S',
    year: 2024,
    capacity: '40 Ton',
    fuelType: 'Diesel',
    bodyType: 'Flatbed',
    pricePerKm: 110,
    pricePerDay: 10000,
    currentLocation: 'Sriperumbudur, Chennai',
    driverAvailable: true,
    assignedDriverId: 'DRV004', // Karthik Raja
    status: 'APPROVED',
    rating: 4.9,
    totalTrips: 15,
    documents: {
      rcBook: 'RC_TRK006.pdf',
      insurance: 'INS_TRK006.pdf',
      images: ['https://images.unsplash.com/photo-1501700490688-6161b209e578?auto=format&fit=crop&q=80&w=800']
    }
  },
  {
    id: 'TRK007',
    ownerId: 'USR002',
    truckNumber: 'TN 38 JK 7777',
    truckType: 'Medium Truck',
    brand: 'Mahindra',
    model: 'Mahindra Furio 12',
    year: 2021,
    capacity: '8 Ton',
    fuelType: 'Diesel',
    bodyType: 'Open Body',
    pricePerKm: 45,
    pricePerDay: 3500,
    currentLocation: 'Koyambedu, Chennai',
    driverAvailable: true,
    status: 'APPROVED',
    rating: 4.4,
    totalTrips: 76,
    documents: {
      rcBook: 'RC_TRK007.pdf',
      insurance: 'INS_TRK007.pdf',
      images: ['https://images.unsplash.com/photo-1592838064575-70ed626d3a44?auto=format&fit=crop&q=80&w=800']
    }
  },
  {
    id: 'TRK008',
    ownerId: 'USR002',
    truckNumber: 'TN 45 BB 2222',
    truckType: 'Mini Truck',
    brand: 'Mahindra',
    model: 'Mahindra Jeeto',
    year: 2023,
    capacity: '1 Ton',
    fuelType: 'CNG',
    bodyType: 'Open Body',
    pricePerKm: 15,
    pricePerDay: 1200,
    currentLocation: 'T Nagar, Chennai',
    driverAvailable: true,
    status: 'APPROVED',
    rating: 4.3,
    totalTrips: 157,
    documents: {
      rcBook: 'RC_TRK008.pdf',
      insurance: 'INS_TRK008.pdf',
      images: ['https://images.unsplash.com/photo-1516576880881-140175b03209?auto=format&fit=crop&q=80&w=800']
    }
  },
  // Simulation: Pending approvals
  {
    id: 'TRK009',
    ownerId: 'USR002',
    truckNumber: 'TN 38 QW 5555',
    truckType: 'Medium Truck',
    brand: 'Eicher',
    model: 'Eicher Pro 2095',
    year: 2024,
    capacity: '9 Ton',
    fuelType: 'Diesel',
    bodyType: 'Open Body',
    pricePerKm: 42,
    pricePerDay: 3200,
    currentLocation: 'Guindy, Chennai',
    driverAvailable: true,
    status: 'PENDING',
    rating: 0.0,
    totalTrips: 0,
    documents: {
      rcBook: 'RC_TRK009.pdf',
      insurance: 'INS_TRK009.pdf',
      pollutionCertificate: 'PUC_TRK009.pdf',
      fitnessCertificate: 'FIT_TRK009.pdf',
      images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800']
    }
  },
  // Simulation: Rejected truck (which can be edited and resubmitted)
  {
    id: 'TRK010',
    ownerId: 'USR002',
    truckNumber: 'TN 22 ER 3333',
    truckType: 'Mini Truck',
    brand: 'Tata',
    model: 'Tata Ace Gold',
    year: 2020,
    capacity: '1.2 Ton',
    fuelType: 'Petrol',
    bodyType: 'Open Body',
    pricePerKm: 18,
    pricePerDay: 1300,
    currentLocation: 'Porur, Chennai',
    driverAvailable: false,
    status: 'REJECTED',
    rating: 3.5,
    totalTrips: 18,
    documents: {
      rcBook: 'RC_TRK010.pdf',
      insurance: 'INS_TRK010.pdf',
      images: ['https://images.unsplash.com/photo-1516576880881-140175b03209?auto=format&fit=crop&q=80&w=800']
    }
  }
];
