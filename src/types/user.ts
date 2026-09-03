export type UserRole = 'CUSTOMER' | 'VENDOR' | 'DRIVER' | 'ADMIN';

export interface RolePrivilegeInfo {
  role: UserRole;
  title: string;
  badgeColor: string;
  icon: string;
  description: string;
  permissions: string[];
}

export const ROLE_PRIVILEGES: Record<UserRole, RolePrivilegeInfo> = {
  CUSTOMER: {
    role: 'CUSTOMER',
    title: 'Goods Owner / Customer',
    badgeColor: '#FF6500', // Orange
    icon: '📦',
    description: 'Book trucks, get instant freight quotes, track live GPS locations & manage payments.',
    permissions: [
      'Search & Book Verified Fleet',
      'Live GPS Cargo Tracking',
      'Digital E-Way Invoices & Receipts',
      'Direct Driver Communication',
    ],
  },
  VENDOR: {
    role: 'VENDOR',
    title: 'Fleet Owner / Vendor',
    badgeColor: '#0EA5E9', // Sky Blue
    icon: '🏢',
    description: 'Register trucks, assign drivers, manage fleet availability & collect payments.',
    permissions: [
      'Register & Manage Truck Fleet',
      'Assign Drivers to Incoming Trips',
      'Track Earnings & Revenue Analytics',
      'Manage Fleet Compliance Documents',
    ],
  },
  DRIVER: {
    role: 'DRIVER',
    title: 'Commercial Truck Driver',
    badgeColor: '#10B981', // Emerald Green
    icon: '🧑‍✈️',
    description: 'Accept trip assignments, update navigation status, navigate routes & upload Proof of Delivery.',
    permissions: [
      'Receive & Accept Active Trips',
      'Turn-by-Turn Route Navigation',
      'Upload POD (Proof of Delivery)',
      'Direct Call to Customer & Vendor',
    ],
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Platform Administrator',
    badgeColor: '#8B5CF6', // Royal Purple
    icon: '🛠️',
    description: 'Verify truck registrations, audit user compliance, oversee bookings & platform analytics.',
    permissions: [
      'Approve / Reject Fleet Documents',
      'Full User Management & Role Control',
      'Global Dispatch & Booking Audit',
      'Platform Commission & Earnings Dashboard',
    ],
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  mobileVerified?: boolean;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  privileges?: string[];
}

