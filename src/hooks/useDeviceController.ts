import { DeviceController } from '@/controllers/DeviceController';
import { useSingleton } from '@/utils/ioc';

export const useDeviceController = () => useSingleton(DeviceController);