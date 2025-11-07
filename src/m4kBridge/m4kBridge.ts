import { humanize } from 'fluxio';
import { M4Kiosk } from './m4kInterface';
import { m4kMethods } from './m4kMethods';
import { setLog } from 'fluxio/logger';

export const m4kBridge = (m4k: M4Kiosk) => {
  const m = m4k as any;
  const g = m4k.global;

  let count = 0;
  const newCb = (name: string) => 'cb_' + name + count++;

  Object.entries(m4kMethods).map(([method, argKeys]) => {
    m[method] = (...args: any[]) =>
      new Promise<any>((resolve, reject) => {
        const cb = newCb(method);
        try {
          g[cb] = (error: any, result: any) => {
            delete g[cb];
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          };
          const o: any = { cb, method };
          const l = args.length;
          for (let i = 0; i < l; i++) {
            const value = args[i];
            const key = argKeys[i];
            if (!key) continue;
            if (typeof value === 'function') {
              const listenerCb = newCb(method + '_' + key);
              g[listenerCb] = value;
              o[key] = listenerCb;
              continue;
            }
            o[key] = value;
          }
          g._m4k.run(JSON.stringify(o));
        } catch (err) {
          delete g[cb];
          reject(err);
        }
      });
  });

  setLog((tag, level, args) => g._m4k.log(level, tag + humanize(args)));
};
