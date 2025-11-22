import { toError } from 'fluxio';
import { glb } from 'fluxio';
import { isFunction } from 'fluxio';
import { Bridge, BridgeMethodsAsyncOrSync } from './interfaces';

export const bridgeBrowser = (bridge: Bridge, methods: BridgeMethodsAsyncOrSync<Bridge> = {}) => {
  const m = bridge as any;

  if (!methods.evalJs) {
    methods.evalJs = async (script: string) => {
      try {
        console.debug('eval', script);
        let result = await glb.eval(script);
        if (isFunction(result)) result = await result(bridge);
        return { success: true, value: result };
      } catch (e) {
        return { success: false, error: String(toError(e)) };
      }
    };
  }

  if (!methods.reload) {
    methods.reload = () => location.reload();
  }

  if (!methods.restart) {
    methods.restart = () => location.reload();
  }

  if (!methods.deviceInfo) {
    methods.deviceInfo = () => ({
      type: 'browser',
      width: screen.width,
      height: screen.height,
    });
  }

  // bind methods
  for (const name in methods) {
    const cb = methods[name as keyof Bridge] as any;
    m[name as keyof Bridge] = async (...args: any[]) => {
      const canLog = name !== 'log';
      if (!cb) {
        canLog && console.warn('m4k', name, 'not implemented', args);
        return null;
      }
      try {
        canLog && console.debug('m4k', name, 'start', args);
        const result = await cb(...args);
        canLog && console.debug('m4k', name, 'result', args, result);
        return result;
      } catch (e) {
        const error = toError(e);
        canLog && console.error('m4k', name, 'error', args, error);
        throw error;
      }
    };
  }

  bridge.global = glb;
};
