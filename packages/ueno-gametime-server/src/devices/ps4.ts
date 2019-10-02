import { Device } from 'ps4-waker';

type PS4AuthToken = {
  'client-type': string;
  'auth-type': string;
  'user-credential': string;
};

export class PS4 {
  // @ts-ignore
  _device: Device;
  constructor(address: string, credentials: PS4AuthToken) {
    this._device = new Device({ address, credentials });
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
