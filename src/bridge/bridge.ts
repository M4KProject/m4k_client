import { removeItem } from 'fluxio';
import { glb } from 'fluxio';
import type { Fully } from './fullyInterfaces';
import { toError } from 'fluxio';
import { logger } from 'fluxio/logger';
import { Bridge, BridgeEvent, BridgeSignalEvent } from './interfaces';
import { bridgeBrowser } from './bridgeBrowser';
import { bridgeFully } from './bridgeFully';
import { bridgeM4k } from './bridgeM4k';

export const bridge = (() => {
  const _m4k = glb._m4k;
  const fully = glb.fully as Fully | undefined;

  console.debug('init bridge', typeof _m4k);

  const m: any = { global: glb };
  const bridge: Bridge = m;
  glb.m4kBridge = bridge;

  _m4k ? bridgeM4k(bridge)
  : fully ? bridgeFully(bridge, fully)
  : bridgeBrowser(bridge);

  bridge.isInterface = !!(_m4k || fully);
  bridge.log = logger('Bridge');

  const listeners: ((event: BridgeEvent) => void)[] = [];

  bridge.subscribe = (listener: (event: BridgeEvent) => void) => {
    listeners.push(listener);
    return () => removeItem(listeners, listener);
  };

  let eventCount = 0;
  bridge.signal = (event: BridgeSignalEvent) => {
    eventCount++;
    if (!event.id) event.id = String(eventCount);
    for (const listener of listeners) {
      try {
        listener(event as BridgeEvent);
      } catch (e) {
        const error = toError(e);
        console.error('listener', event, error);
      }
    }
  };

  bridge.log.i('ready');

  const onM4k = glb.onM4k;
  if (onM4k) onM4k(bridge);

  // setTimeout(() => {
  //     document.querySelectorAll('meta[name="viewport"]').forEach(meta => meta.remove())
  //     const meta = document.createElement('meta')
  //     meta.name = 'viewport'
  //     meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  //     document.head.appendChild(meta)
  // }, 10)

  return bridge;
})();
