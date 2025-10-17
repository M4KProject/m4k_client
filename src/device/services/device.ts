import { m4k, M4kResizeOptions } from '@common/m4k';
import {
  Msg,
  req,
  sleep,
  toStr,
  uuid,
  toError,
  parse,
  randKey,
  ReqError,
  toVoid,
} from '@common/utils';
import { ApiAuth, authLogin, authSignUp, DeviceModel } from '@common/api';
import { serverDate } from '@common/api/serverTime';
import { deviceSync } from '@/api/sync';

export const deviceEmail$ = new Msg('', 'deviceEmail', true);
export const devicePassword$ = new Msg('', 'devicePassword', true);
export const deviceAuth$ = new Msg<ApiAuth | null>(null, 'deviceUser', true);
export const device$ = new Msg<DeviceModel | null>(null, 'device', true);
export const deviceAction$ = new Msg<DeviceModel['action'] | null>(null, 'deviceAction', true);

const deviceLogin = async (): Promise<DeviceModel> => {
  let email = deviceEmail$.v;
  let password = devicePassword$.v;
  console.debug('deviceLogin', email);

  let deviceAuth: ApiAuth | null = null;

  if (email && password) {
    try {
      deviceAuth = await authLogin(email, password);
      console.debug('deviceLogin login deviceAuth', deviceAuth);
    } catch (error) {
      console.info('deviceLogin login error', error);
      if (!(error instanceof ReqError)) throw error;
      if (error.status !== 400) throw error;
    }
  }

  if (!deviceAuth) {
    email = uuid() + '@m4k.fr';
    password = randKey(20);

    try {
      deviceAuth = await authSignUp(email, password);
      console.debug('deviceLogin signUp user', deviceAuth);
    } catch (error) {
      console.info('deviceLogin signUp error', error);
      throw error;
    }
  }

  if (!deviceAuth) throw new Error('no user');

  deviceAuth$.set(deviceAuth);
  deviceEmail$.set(email);
  devicePassword$.set(password);

  const info = await m4k.info();
  info.started = serverDate();

  const device = await deviceSync.coll.upsert(
    { user: deviceAuth.id },
    {
      user: deviceAuth.id,
      online: serverDate(),
      info,
    }
  );
  console.debug('deviceLogin device', device);

  device$.set(device);

  return device;
};

let deviceUnsubscribe = toVoid;
const deviceStart = async () => {
  console.debug('deviceStart');
  const device = await deviceLogin();

  deviceUnsubscribe();

  console.debug('deviceStart subscribe', device.id);
  deviceUnsubscribe = deviceSync.coll.on((device, action) => {
    console.debug('deviceStart subscribe', action, device);
    if (action === 'delete') {
      deviceLogin();
      return;
    }
    device$.set(device);
  }, device.id);

  while (true) {
    await deviceLoop();
    await sleep(10000);
  }
};

const deviceLoop = async () => {
  let device = device$.v;
  console.debug('deviceLoop device', device);

  if (!device) throw new Error('no device');

  device = await deviceSync.update(device.id, {
    online: serverDate(),
  });
  console.debug('deviceLoop updated', device);
  if (!device) throw new Error('no device update');

  device$.set(device);
};

export const deviceInit = async () => {
  while (true) {
    try {
      await deviceStart();
    } catch (e) {
      console.warn('deviceInit', toError(e));
    }
    await sleep(60000);
  }
};

device$.on((device) => {
  deviceAction$.set(device?.action);
});

deviceAction$.on(() => device$.v && runAction(device$.v));

const capture = async (device: DeviceModel, options?: M4kResizeOptions | undefined) => {
  const url = await m4k.capture(options);
  const blob = await req('GET', url, { resType: 'blob' });
  return await deviceSync.update(device.id, { capture: blob });
};

const execAction = async (device: DeviceModel, action: string, input?: string) => {
  switch (action) {
    case 'reload':
      return m4k.reload();
    case 'reboot':
      return await m4k.reboot();
    case 'restart':
      return await m4k.restart();
    case 'exit':
      return await m4k.exit();
    case 'capture':
      await capture(device, parse(input || '') as M4kResizeOptions);
      return;
    case 'js':
      return await m4k.evalJs(toStr(input));
    case 'sh':
      return await m4k.sh(toStr(input));
    case 'su':
      return await m4k.su(toStr(input));
    case 'info':
      return await m4k.info();
    case 'ping':
      return input;
    case 'kiosk_on':
      return await m4k.setKioskOn(input !== 'false');
    case 'screen_on':
      return await m4k.setScreenOn(input !== 'false');
  }
};

const runAction = async (device: DeviceModel) => {
  console.debug('runAction', device.action, device.input, device);

  if (!device) throw toError('no device');

  const { action, input } = device;
  if (!action) return;

  await deviceSync.update(device.id, { action: '', online: serverDate() });

  let value: any = null;
  let error: any = null;

  try {
    value = await execAction(device, action, input);
  } catch (err) {
    error = err;
  }

  await deviceSync.update(device.id, {
    action: '',
    result: {
      success: !error,
      action,
      input,
      value,
      error,
    },
    online: serverDate(),
  });
};

// import { m4k } from "@common/m4k";
// import supabase from "./supabase";
// import { uuid } from "@common/utils/str";
// import { actionRepo, deviceSync } from "./repos";
// import { User } from "@supabase/supabase-js";
// import { Tables } from "./database.types";
// import { sleep } from "@common/utils/async";
// import { pbDevices, pbUsers } from './pb';

// type Device = Tables<"devices">
// type Action = Tables<"actions">

// let device: Device|null = null

// const getCredentials = async () => {

//     console.info('auth get credentials', email)

//     if (email && password) return { email, password }
// }

// const createCredentials = async () => {
//     const newEmail = uuid() + '@k.m4k.fr'
//     const newPassword = uuid()

//     console.info('auth new credentials', newEmail)

//     await m4k.set("auth_email", newEmail)
//     await m4k.set("auth_password", newPassword)

//     return await getCredentials()
// }

// const authUser = async (): Promise<User> => {
//     const auth = await supabase.auth.getSession().catch((e) => {
//         console.warn('authUser getSession', e)
//         return null
//     })
//     const session = auth?.data.session
//     if (session) return session.user

//     let credentials = await getCredentials()
//     console.debug('auth credentials', credentials)

//     if (!credentials) {
//         credentials = await createCredentials()
//         console.debug('auth new credentials', credentials)
//         if (!credentials) throw new Error('no new credentials')

//         const signUpResponse = await supabase.auth.signUp(credentials)
//         const signUpError = signUpResponse.error
//         const signUpSession = signUpResponse.data.session

//         if (signUpError) throw signUpError
//         if (!signUpSession?.user) throw new Error("no signUp user")
//     }

//     if (credentials) {
//         console.debug('auth signInWithPassword', credentials)
//         const signInResponse = await supabase.auth.signInWithPassword(credentials).catch((error) => {
//             console.warn('authUser signInWithPassword', error)
//             return null
//         })
//         console.debug('auth signInResponse', signInResponse)

//         const signInError = signInResponse?.error
//         const signInSession = signInResponse?.data.session

//         if (signInError?.code === 'invalid_credentials') {
//             console.debug('auth invalid_credentials')
//             await m4k.set("auth_email", undefined)
//             await m4k.set("auth_password", undefined)
//             return await authUser()
//         }

//         if (signInError) throw signInError
//         if (!signInSession?.user) throw new Error("no signIn user")

//         return signInSession.user
//     }

//     throw new Error('no signIn')
// }

// const getOrCreateDevice = async () => {
//     if (device) return device

//     const user = await authUser()

//     device = await deviceSync.findOne({ user_id: user.id })
//     if (device) return device

//     device = await deviceSync.insert({ user_id: user.id })
//     return device
// }

// const getActions = async () => {
//     const device = await getOrCreateDevice()

//     const actions = await actionRepo.query(query => query
//         .eq('device_id', device.id)
//         .not('started_at', 'is', null)
//         .order('created_at', { ascending: false })
//     )

//     return actions
// }

// const deviceInit = async () => {
//     return;

//     const started_at = new Date().toISOString()

//     try {
//         const user = await authUser()
//         console.info('user', user)

//         const device = await getOrCreateDevice()
//         console.info('device', device)

//         const deviceInfo = await m4k.deviceInfo();
//         await deviceSync.update(device.id, {
//             type: deviceInfo.model,
//             started_at: new Date().toISOString(),
//             online_at: new Date().toISOString(),
//             width: deviceInfo.width,
//             height: deviceInfo.height,
//             version: deviceInfo.software,
//         })
//     }
//     catch (error) {
//         console.error('deviceInit', error)
//     }

//     // const session = await deviceAuth()
//     // console.debug("deviceInit session", session)

//     // const userId = session.user.id
//     // const device = await getOrCreateDevice(userId)
//     // if (device.name) await m4k.set("name", device.name)

//     // const createDevice = async (): Promise<DeviceModel> => {
//     //     try {
//     //         const username = 'U_' + Date.now().toString(16) + randString(3);
//     //         const password = 'P_' + randString(20);
//     //         logInfo('create device', username);
//     //         await deviceSync.create({ username, password, passwordConfirm: password }, { select: ['id'] });
//     //         setLogin({ username, password });
//     //         logInfo('create device ok', username);
//     //         return await deviceLogin();
//     //     }
//     //     catch (error) {
//     //         logError('create device error', error);
//     //         throw error;
//     //     }
//     // }

//     // const deviceLogin = async (): Promise<DeviceModel> => {
//     //     try {
//     //         const { username, password } = (await getLogin()) || {};
//     //         if (!username || !password) return createDevice();
//     //         logInfo('wait device login', { username });
//     //         const device = await deviceSync.login(username, password);
//     //         if (device) logInfo('device login ok', username, device.id);
//     //         return device;
//     //     }
//     //     catch (e: any) {
//     //         const err = toError(e);
//     //         logWarn('device login error', err.data, err);
//     //         if (err.code === 400) {
//     //             await sleep(2000);
//     //             return await createDevice();
//     //         }
//     //         throw err;
//     //     }
//     // }

//     // while(true) {
//     //     try {
//     //         const device = await deviceLogin();
//     //         if (device) return device;
//     //     }
//     //     catch (error) {}
//     //     await sleep(10000);
//     // }

// }

// export default deviceInit
