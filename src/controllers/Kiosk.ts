import { app } from '@/app';
import { bridge, BridgeFileInfo, BridgeResizeOptions } from '@/bridge';
import {
  sleep,
  uuid,
  toError,
  randString,
  toVoid,
  fluxStored,
  isItem,
  isStringValid,
  logger,
  flux,
  serverDate,
  SECOND,
  Dictionary,
  isDictionary,
  notImplemented,
} from 'fluxio';
import { api2, MDevice } from '@/api2';
import { fluxProp } from 'fluxio';
import { useMemo } from 'preact/hooks';
import { useFlux, useFluxState } from '@/hooks/useFlux';
import { DeviceModel } from '@/api/models';
import copyPlaylist from './copyPlaylist';

export interface DeviceLogin {
  email?: string;
  password?: string;
}

export type ItemFit = 'contain' | 'cover' | 'fill';
export type ItemAnim = 'rightToLeft' | 'topToBottom' | 'fade' | 'zoom';

export interface DeviceConfig {
    copyDir?: string;
    bgColor?: string; // '#000000'
    url?: string;
    itemDurationMs?: number; // 5000
    itemFit?: ItemFit; // 'contain'
    itemAnim?: ItemAnim; // 'zoom'
    hasVideoMuted?: boolean; // true
    offlineMode?: boolean; // false
    codePin?: string; // yoyo
}

export const isItemFit = (v: string) => v === 'contain' || v === 'cover' || v === 'fill';
export const isItemAnim = (v: string) =>
  v === 'rightToLeft' || v === 'topToBottom' || v === 'fade' || v === 'zoom';

export type KioskPage =
  | 'codePin'
  | 'kiosk'
  | 'actions'
  | 'playlist'
  | 'configPlaylist'
  | 'wifi'
  | 'test'
  | 'logs'
  | 'events'
  | 'pairing'
  | '';

export interface PlaylistItem extends BridgeFileInfo {
  waitMs?: number;
}

const log = logger('Kiosk');
export const kPage$ = flux<KioskPage>('kiosk');
export const kConfig$ = fluxStored<DeviceConfig>('kConfig', {}, isItem);
export const kLogin$ = fluxStored<DeviceLogin>('kLogin', {}, isItem);
export const kCodePin$ = fluxStored<string>('kCodePin', 'yoyo', isStringValid);
export const kPlaylist$ = fluxStored<{ items?: (BridgeFileInfo)[] }>('kPlaylist', {}, isItem);

app.kPage$ = kPage$;
app.kConfig$ = kConfig$;

export const useKDevice = () => useFlux(api2.devices.kDevice$);

export const setKProp = <K extends keyof DeviceConfig>(prop: K, value: DeviceConfig[K]) => (
  kConfig$.set(config => ({ ...config, [prop]: value }))
);

export const getKProp = <K extends keyof DeviceConfig>(prop: K): DeviceConfig[K] => (
  kConfig$.get()[prop]
);

export const useKProp$ = <K extends keyof DeviceConfig>(prop: K) => (
  useMemo(() => fluxProp(kConfig$, prop), [prop]));

export const useKProp = <K extends keyof DeviceConfig>(prop: K) => (
  useFluxState(useKProp$(prop)));

export const kLogin = async () => {
  let { email, password } = kLogin$.get();

  if (!isStringValid(email) || !isStringValid(password)) {
    email = uuid() + '@d.m4k.fr';
    password = randString(20);
    kLogin$.set({ email, password });
  }
  
  const info = await bridge.deviceInfo();
  
  await api2.devices.login(email, password, info);
}

const capture = async (input: BridgeResizeOptions) => {
    // const base64 = await bridge.capture();
    // const blob = base64toBlob(base64);
    // if (isBlob(blob)) {
    //   await this.api.device.update(device.id, { capture: blob }, { select: [] });
    // }
}

let _input: Dictionary<any> = {};

const getInputString = () => _input.value;

const notImplementedAction = () => {
  throw notImplemented('action');
};

const actionDico = {
  '': toVoid,
  reload: () => bridge.reload(),
  reboot: () => bridge.reboot(),
  restart: () => bridge.restart(),
  exit: () => bridge.exit(),
  capture: () => capture(_input as BridgeResizeOptions),
  js: () => bridge.evalJs(getInputString()),
  sh: () => bridge.sh(getInputString()),
  su: () => bridge.su(getInputString()),
  info: () => bridge.deviceInfo(),
  ping: () => _input,
  kioskOn: () => bridge.setKioskOn(true),
  kioskOff: () => bridge.setKioskOn(false),
  screenOn: () => bridge.setScreenOn(true),
  screenOff: () => bridge.setScreenOn(false),
};

export type KAction = keyof typeof actionDico;

const execAction = async (action: KAction, input: any) => {
  _input = isDictionary(input) ? input : { value: input };

  const fun = actionDico[action] || notImplementedAction;

  const value = await fun();
  log.d('execAction', action, input, value);

  return value;
} 

const onLoop = async (changes: Partial<MDevice> = {}) => {
  const device = await api2.devices.loop(changes);
  if (!device) throw toError('onLoop no device');

  api2.setGroupId(device.groupId);

  const { action, input } = device;
  if (!action) return;

  const result: DeviceModel['result'] = { action, input, started: serverDate() };

  try {
    result.value = await execAction(action, input);
    result.success = true;
  }
  catch (error) {
    log.w('execAction', action, input, error);
    const { name, message } = toError(error);
    result.error = { name, message };
    result.success = false;
  }

  result.ended = serverDate();

  log.i('execAction', action, input, result);

  await onLoop({ result });
}

let _isKInit = false;

export const kInit = async () => {
  if (_isKInit) return;
  _isKInit = true;

  log.i('kInit');

  bridge.subscribe(async (e) => {
    if (e.type !== 'storage' || e.action !== 'mounted') return;
    await copyPlaylist();
  });

  await kLogin().catch(toVoid);

  while (true) {
    await sleep(10 * SECOND);

    try {
      await onLoop();
    }
    catch (error) {
      log.e('kInit loop', error);
      await kLogin().then(() => onLoop()).catch(toVoid);
    }
  }
}
