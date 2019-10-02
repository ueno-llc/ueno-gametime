import SerialPort from 'serialport';

// from the epson user manual
const BAUD_RATE = 9600;
const DATA_BITS = 8;
const STOP_BITS = 1;
const PARITY = 'none';

export class Projector {
  constructor(private serialPath: string) {}

  setup(): Promise<SerialPort> {
    return new Promise((resolve, reject) => {
      const port = new SerialPort(this.serialPath, {
        baudRate: BAUD_RATE,
        dataBits: DATA_BITS,
        stopBits: STOP_BITS,
        parity: PARITY,
      }).setEncoding('ascii');

      port.open(err => {
        if (err) {
          return reject(err);
        }

        resolve(port);
      });
    });
  }

  async turnOn() {
    await this.toggle(true);
  }

  static async nullCommand(port: SerialPort) {
    try {
      const res = await Projector.command(port, '');
      return res === ':';
    } catch (e) {
      return false;
    }
  }

  async toggle(on: boolean) {
    const conn = await this.setup();

    const response = await Projector.nullCommand(conn);

    // the projector is already on
    if (response === on) {
      return;
    }

    await Projector.command(conn, 'PWR', on ? 'ON' : 'OFF');

    conn.destroy();
  }

  static command(port: SerialPort, command: string, parameter?: string) {
    return new Promise((resolve, reject) => {
      let result = '',
        commandString = `${command}\n`;

      if (parameter) {
        commandString = `${command} ${parameter}\n`;
      }

      port.write(commandString, 'ascii', (err, written) => {
        if (err) {
          return reject(err);
        }

        port.on('readable', () => {
          let response = port.read() as string;

          if (response === ':') {
            resolve(result);
          } else {
            result = response;
          }
        });
      });
    });
  }

  async turnOff() {
    await this.toggle(false);
  }
}
