import { DeviceController } from '@/controllers/DeviceController';
import { useSingleton } from './useSingleton';

export const useDeviceController = () => useSingleton(DeviceController);
