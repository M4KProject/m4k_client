import { DeviceModel } from '@common/api/models';
import { useMsg } from '@common/hooks';
import { isItem, isStr, Msg } from '@common/utils';
import { collDevices } from '@common/api/collDevices';

export const deviceKey$ = new Msg('', 'deviceKey$', true, isStr);
export const device$ = new Msg<DeviceModel>(null, 'device$', true, isItem);

deviceKey$.debounce(10).on(async (key) => {
    const prev = device$.v;
    if (prev && prev.key === key) return;
    const next = await collDevices.findKey(key);
    if (next && deviceKey$.v === next.key) device$.set(next);
});

device$.debounce(10).on(device => {
    deviceKey$.set(device?.key || '');
});

export const useDeviceKey = () => useMsg(deviceKey$);
export const useDevice = () => useMsg(device$);