import { SpaService } from '../types/booking';

export const SPA_SERVICES: SpaService[] = [
  {
    id: 'bath-fluff',
    name: 'Hydro-Bath & Blow Dry',
    category: 'both',
    duration: '45 mins',
    price: 25,
    description: 'Gentle organic shampoo, ear cleaning, thorough blow dry, and lavender scent spritz.',
    iconName: 'bath',
  },
  {
    id: 'full-groom',
    name: 'Full Royal Grooming',
    category: 'both',
    duration: '90 mins',
    price: 55,
    description: 'Complete bath, styled haircut, sanitary trim, nail clipping, paw balm & teeth brushing.',
    iconName: 'scissors',
    popular: true,
  },
  {
    id: 'paw-nail-care',
    name: 'Pawdicure & Nail Trim',
    category: 'both',
    duration: '30 mins',
    price: 18,
    description: 'Precision nail clipping, filing, paw pad moisturization, and knot de-matting.',
    iconName: 'sparkles',
  },
  {
    id: 'spa-massage',
    name: 'Aromatherapy & Herbal Spa',
    category: 'both',
    duration: '60 mins',
    price: 45,
    description: 'Calming skin & coat herbal bath soak with gentle muscle relaxation massage.',
    iconName: 'heart',
  },
];

export const AVAILABLE_TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
];
