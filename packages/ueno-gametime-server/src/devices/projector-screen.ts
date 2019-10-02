import * as knx from 'knx';
// b c1 16 f 0 3 07e1008159

export class ProjectorScreen {
  constructor(private address: string) {}

  down(conn: knx.Connection, duration: number = 10000) {
    const dp = new knx.Datapoint({ ga: this.address, dpt: 'DPT1.001' }, conn);

    return new Promise(resolve => {
      dp.write(1);
      dp.write(0);

      setTimeout(() => {
        dp.write(1);

        resolve();
      }, duration);
    });
  }

  status(conn: knx.Connection) {
    const dp = new knx.Datapoint({ ga: this.address, dpt: 'DPT1.001' }, conn);

    return new Promise(resolve => dp.read((_, val) => resolve(val)));
  }

  async up(conn: knx.Connection) {
    const dp = new knx.Datapoint({ ga: this.address, dpt: 'DPT1.001' }, conn);
    dp.write(0);
  }
}
