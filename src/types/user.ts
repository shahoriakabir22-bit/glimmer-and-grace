import { DeliveryDetails } from './order';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'superadmin' | 'admin' | 'customer';
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  savedAddresses?: DeliveryDetails[];
  createdAt: string;
  updatedAt?: string;
}
