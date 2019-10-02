import { Device } from 'ps4-waker';

type PS4AuthToken = {
  'client-type': string;
  'auth-type': string;
  'user-credential': string;
};

export class PS4 {
  // @ts-ignore
  _device: Device;
  constructor(credentials: PS4AuthToken, address?: string) {
    this._device = new Device({ credentials, address });
  }

  async turnOn() {
    await this._device.turnOn();
  }

  async turnOff() {
    await this._device.turnOff();
  }

  async detect() {
    return await this._device._detect();
  }

  async startTitle(title: string) {
    await this._device.startTitle(title);
  }
}
