import { useMemo } from 'preact/hooks';
import { ioc } from '@/utils/ioc';

type Class<T = any> = new (...args: any[]) => T;

/**
 * Hook to get singleton instance from IoC container
 * Returns stable reference across renders
 *
 * @example
 * const deviceCtrl = useSingleton(Kiosk);
 */
export const useSingleton = <T>(clazz: Class<T>): T => {
  return useMemo(() => ioc.get(clazz), [clazz]);
};
