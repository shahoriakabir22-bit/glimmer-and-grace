import { DeliveryDetails } from './order';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'admin' | 'customer';
  isAdmin: boolean;
  savedAddresses?: DeliveryDetails[];
  createdAt: string;
  updatedAt?: string;
}
