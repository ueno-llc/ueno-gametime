import { fetch } from 'node-fetch';
import { Device, Socket } from 'ps4-waker';

const config = {
  apiUrl: 'http://192.168.1.x/',
  screenPinUp: 2,
  screenPinDown: 3,
};

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
const mcu = (path: string) => fetch(`${config.apiUrl}/${path}`);
const digital = (pin: number, flag: boolean | number) => mcu(`digital/${pin}/${Number(flag)}`);

/**
 * Game Time
 */
async function gameTime() {
  // projector remote: power
  await mcu('ir?params=power');

  // pull down the screen
  await digital(config.screenPinDown, true);
  await delay(3000);
  await digital(config.screenPinDown, false);

  // turn on PS4
  const device = new Device(); // @todo setup socket
  await device.startTitle('CUSA00123'); // @todo set correct title
}

/**
 * Wrap Up
 */
async function wrapUp() {
  // projector remote: power
  await mcu('ir?params=power');

  // pull up the screen
  await digital(config.screenPinUp, true);
  await delay(3000);
  await digital(config.screenPinUp, false);

  // turn off PS4
  const device = new Device(); // @todo setup socket
  await device.turnOff();
}
