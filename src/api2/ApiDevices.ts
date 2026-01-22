import { fluxStored, isItem, isString, isUuid, toError } from "fluxio";
import { ApiRest } from "./ApiRest";
import { MAuthDevice, MDevice, MDeviceInfo } from "./models";

export class ApiDevices extends ApiRest<MDevice> {
  kId$ = fluxStored<string>('kId$', '', isString);
  kDevice$ = fluxStored<MDevice|null>('kDevice$', null, isItem);

  async login(email: string, password: string, info: MDeviceInfo) {
    this.client.auth$.set(null);

    const auth = await this.client.post<MAuthDevice>('devices/login', { email, password, info });

    const id = auth.deviceId;
    if (!isUuid(id)) throw toError('no auth device id');

    this.client.auth$.set(auth);
    this.kId$.set(id);

    return auth;
  }

  async loop(changes: Partial<MDevice>|{ remove: true }) {
    const device = await this.client.post<MDevice>('devices/loop', changes);
    this.kDevice$.set(device);
    return device;
  }
}