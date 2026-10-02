export type PetType = 'dog' | 'cat';

export interface SpaService {
  id: string;
  name: string;
  category: 'dog' | 'cat' | 'both';
  duration: string;
  price: number;
  description: string;
  iconName: 'scissors' | 'bath' | 'sparkles' | 'heart';
  popular?: boolean;
}

export interface Booking {
  id: string;
  petType: PetType;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  timeSlot: string;
  petName: string;
  petBreed: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: string;
}
