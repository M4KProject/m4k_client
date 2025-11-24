import type { Dictionary } from 'fluxio';

type Class<T = any> = new (...args: any[]) => T;
type Factory<T = any> = () => T;

class Ioc {
  private instances: Dictionary<any> = {};
  private factories: Dictionary<Factory> = {};

  /**
   * Register a class or factory in the container
   */
  register<T>(clazz: Class<T>, factory?: Factory<T>): void {
    const key = clazz.name;
    if (factory) {
      this.factories[key] = factory;
    } else {
      this.factories[key] = () => new clazz();
    }
  }

  /**
   * Get or create singleton instance
   */
  get<T>(clazz: Class<T>): T {
    const key = clazz.name;

    // Return existing instance
    if (this.instances[key]) {
      return this.instances[key];
    }

    // Create new instance
    const factory = this.factories[key] || (this.factories[key] = () => new clazz());

    const instance = factory();
    this.instances[key] = instance;
    return instance;
  }

  /**
   * Check if a class is registered
   */
  has<T>(clazz: Class<T>): boolean {
    return !!this.factories[clazz.name];
  }

  /**
   * Clear all instances or a specific instance
   */
  clear(clazz?: Class<any>): void {
    if (clazz) {
      delete this.instances[clazz.name];
      return;
    }
    this.instances = {};
  }
}

// Global container instance
export const ioc = new Ioc();

/**
 * Register a class or factory in the IoC container
 *
 * @example
 * // Register with auto-instantiation
 * register(ApiService);
 *
 * // Register with custom factory
 * register(ApiService, () => new ApiService(config));
 */
export const register = <T>(clazz: Class<T>, factory?: Factory<T>): void => {
  ioc.register(clazz, factory);
};

/**
 * Get singleton instance from IoC container
 *
 * @example
 * const api = getSingleton(ApiService);
 */
export const getSingleton = <T>(clazz: Class<T>): T => {
  return ioc.get(clazz);
};
