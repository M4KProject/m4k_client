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
  isUuid,
  SECOND,
  Dictionary,
  isDictionary,
  notImplemented,
} from 'fluxio';
import { api2, MDeviceResult } from '@/api2';
import { fluxProp } from 'fluxio';
import { useMemo } from 'preact/hooks';
import { useFluxState } from '@/hooks/useFlux';

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

export const setKProp = <K extends keyof DeviceConfig>(prop: K, value: DeviceConfig[K]) => (
  kConfig$.set(config => ({ ...config, [prop]: value })));

export const useKProp$ = <K extends keyof DeviceConfig>(prop: K) => (
  useMemo(() => fluxProp(kConfig$, prop), [prop]));

export const useKProp = <K extends keyof DeviceConfig>(prop: K) => (
  useFluxState(useKProp$(prop)));

export const kLogin = async () => {
  let login = kLogin$.get();

  if (!isStringValid(login.email)) login.email = uuid() + '@d.m4k.fr';
  if (!isStringValid(login.password)) login.password = randString(20);

  await api2.authDevice(login.email, login.password);

  const auth = api2.getAuth();
  const deviceId = auth?.deviceId;
  if (!isUuid(deviceId)) throw toError('no auth deviceId');

  api2.devices.id$.set(deviceId);

  const info = await bridge.deviceInfo();

  await api2.devices.update(deviceId, {
    started: serverDate(),
    online: serverDate(),
    info,
  }, { fields: ['id'] });
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

const execAction = async (deviceId: string, action: KAction, input: any) => {
  _input = isDictionary(input) ? input : { value: input };

  const fun = actionDico[action] || notImplementedAction;

    const result = await fun();
    log.d('execAction', action, input, result);

    return {
      success: true,
      result,
    };
}

const onAction = async (deviceId: string, action: KAction) => {
  const result: MDeviceResult = { action, started: serverDate() };
  const device = await api2.devices.update(deviceId, { action: '', result }, { fields: ['input'] });
  if (!device) throw toError('onAction no device');

  const input = result.input = device.input;

  try {
    const value = await execAction(deviceId, action, input);
    result.success = true;
    result.value = value;
  }
  catch (error) {
    log.w('execAction', action, input, error);
    const { name, message } = toError(error);
    result.success = true;
    result.error = { name, message };
  }

  result.ended = serverDate();

  log.i('execAction', action, input, result);

  await api2.devices.update(deviceId, { action: '', input: null, result }, { fields: ['id'] });
}

export const getDeviceId = api2.devices.id$.getter();

const onLoop = async () => {
  const deviceId = getDeviceId();

  const device = await api2.devices.update(deviceId, { online: serverDate() }, { fields: ['id', 'key', 'action'] });
  if (!device) throw toError('no device');

  const action = device.action;
  if (action) await onAction(deviceId, action);
}

let _isKInit = false;
export const kInit = async () => {
  if (_isKInit) return;
  _isKInit = true;

  await kLogin();

  bridge.subscribe(async (e) => {
    if (e.type !== 'storage' || e.action !== 'mounted') return;
    // await copyPlaylist(this, `${e.path}/${this.copyDir$.get()}`);
  });

  while (true) {
    try {
      await onLoop();
    }
    catch (error) {
      log.e('kInterval', error);
      await kLogin();
    }

    await sleep(5 * SECOND);
  }
}
