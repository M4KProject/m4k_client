import { Kiosk } from '@/controllers/Kiosk';
import { useSingleton } from './useSingleton';

export const useKiosk = () => useSingleton(Kiosk);
