import { removeItem } from 'fluxio';
import { m4kBridge } from './m4kBridge';
import { m4kFully } from './m4kFully';
import { m4kBase } from './m4kBase';
import type { M4Kiosk, M4kEvent, M4kSignalEvent } from './m4kInterface';
import { glb } from 'fluxio';
import type { Fully } from './fullyInterfaces';
import { toError } from 'fluxio';
import { logger } from 'fluxio/logger';

export const m4k = (() => {
  const _m4k = glb._m4k;
  const fully = glb.fully as Fully | undefined;

  console.debug('init m4k', typeof _m4k);

  const m: any = { global: glb };
  const m4k: M4Kiosk = m;
  glb.m4k = m4k;

  _m4k ? m4kBridge(m4k)
  : fully ? m4kFully(m4k, fully)
  : m4kBase(m4k);
  m4k.isInterface = !!(_m4k || fully);

  const log = logger('M4K');
  m4k.d = log.d;
  m4k.i = log.i;
  m4k.w = log.w;
  m4k.e = log.e;

  const listeners: ((event: M4kEvent) => void)[] = [];

  m4k.subscribe = (listener: (event: M4kEvent) => void) => {
    listeners.push(listener);
    return () => removeItem(listeners, listener);
  };

  let eventCount = 0;
  m4k.signal = (event: M4kSignalEvent) => {
    eventCount++;
    if (!event.id) event.id = String(eventCount);
    for (const listener of listeners) {
      try {
        listener(event as M4kEvent);
      } catch (e) {
        const error = toError(e);
        console.error('listener', event, error);
      }
    }
  };

  const onM4k = glb.onM4k;
  if (onM4k) onM4k(m4k);

  console.info('m4k ready');

  // setTimeout(() => {
  //     document.querySelectorAll('meta[name="viewport"]').forEach(meta => meta.remove())
  //     const meta = document.createElement('meta')
  //     meta.name = 'viewport'
  //     meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  //     document.head.appendChild(meta)
  // }, 10)

  return m4k;
})();
