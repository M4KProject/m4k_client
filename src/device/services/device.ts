import { m4k, M4kResizeOptions } from '@common/m4k';
import { Msg, req, sleep, toNbr, toItem, toStr, uuid } from '@common/helpers';
import { DeviceModel, deviceColl, UserModel, login, signUp, apiNow, auth$ } from '@common/api';

export const authEmail$ = new Msg('', 'auth_email', true);
export const authPassword$ = new Msg('', 'auth_password', true);
export const device$ = new Msg<DeviceModel|null>(null, 'device', true);

const uniqueKey = () => uuid().split('-').join('');

const getErrorStatus = (error: any) => toNbr(error?.data?.status, null)

export const deviceLogin = async (): Promise<UserModel> => {
    let email = authEmail$.v;
    let password = authPassword$.v;
    console.debug('deviceLogin', email, password);

    if (!email) authEmail$.set(email = uniqueKey() + '@m4k.fr');
    if (!password) authPassword$.set(password = uniqueKey());

    try {
        const response = await login(email, password);
        console.debug('deviceLogin response', response);
        return response;
    }
    catch (error) {
        if (getErrorStatus(error) === 400) {
            console.warn('deviceLogin error 400', error);
            try {
                await signUp(email, password);
            }
            catch (error) {
                console.warn('deviceLogin create error', error);
                if (getErrorStatus(error) === 400) {
                    authEmail$.set(email = '');
                    authPassword$.set(password = '');
                }
            }
            return await deviceLogin();
        }
        console.warn('deviceLogin error2', error);
        throw error;
    }
}

export const _deviceInit = async () => {
    let device: DeviceModel|null;

    const user = await deviceLogin();
    console.debug('_deviceInit user', user.id);

    const { width, height, type, ...info } = await m4k.info();

    device = await deviceColl.upsert(
        { user: user.id },
        {
            user: user.id,
            status: 'started',
            started: apiNow(),
            online: apiNow(),
            type,
            width,
            height,
            info,
        },
    );
    console.debug('device', device.id);
    device$.set(device);

    while(true) {
        await sleep(10000);
        try {
            const update = await deviceColl.update(device.id, {
                status: 'updated',
                online: apiNow(),
            });
            if (!update) break;
            device = update;
            device$.set(update);
            if (device.action) {
                console.debug('device action', device.action, device.input);
                await runAction(device);
            }
        }
        catch (error) {
            console.warn('deviceInit', error);
        }
    }
}

export const deviceInit = async () => {
    while (true) {
        try {
            await _deviceInit();
        }
        catch (error) {
            console.warn('deviceInit', error)
        }
        await sleep(60000);
    }
}

const capture = async (device: DeviceModel, options?: M4kResizeOptions | undefined) => {
    const url = await m4k.capture(options);
    const blob = await req('GET', url, { responseType: 'blob' })
    return await deviceColl.update(device.id, { capture: blob });
}

const execAction = async (device: DeviceModel) => {
    const { action, input } = device
    switch(action) {
        case 'reload':
            return m4k.reload();
        case 'capture':
            await capture(device, toItem(input));
            return;
        case 'js':
            return await m4k.js(toStr(input));
        case 'sh':
            return await m4k.sh(toStr(input));
        case 'su':
            return await m4k.su(toStr(input));
        case 'exit':
            return await m4k.exit();
        case 'info':
            return await m4k.info();
        case 'ping':
            return 'pong';
        case 'reboot':
            return await m4k.reboot();
        case 'restart':
            return await m4k.restart();
        case 'kiosk_on':
            return await m4k.setKioskOn(input !== false);
        case 'screen_on':
            return await m4k.setScreenOn(input !== false);
    }
}

const runAction = async (device: DeviceModel) => {
    const { action } = device

    await deviceColl.update(device.id, { status: 'action_started' });

    let value: any = null;
    let error: any = null;

    try {
        value = await execAction(device);
    }
    catch (err) {
        error = err;
    }

    await deviceColl.update(device.id, {
        action: '',
        result: {
            success: !error,
            action,
            value,
            error
        },
        status: 'action_ended',
    });
}



// import { m4k } from "@common/m4k";
// import supabase from "./supabase";
// import { uuid } from "@common/helpers/str";
// import { actionRepo, deviceRepo } from "./repos";
// import { User } from "@supabase/supabase-js";
// import { Tables } from "./database.types";
// import { sleep } from "@common/helpers/async";
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

//     device = await deviceRepo.findOne({ user_id: user.id })
//     if (device) return device

//     device = await deviceRepo.insert({ user_id: user.id })
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
//         await deviceRepo.update(device.id, {
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
//     //         await deviceRepo.create({ username, password, passwordConfirm: password }, { select: ['id'] });
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
//     //         const device = await deviceRepo.login(username, password);
//     //         if (device) logInfo('device login ok', username, device.id);
//     //         return device;
//     //     }
//     //     catch (e: any) {
//     //         const err = toErr(e);
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