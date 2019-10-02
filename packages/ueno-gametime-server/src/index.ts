import * as knx from 'knx';
import { PS4 } from './devices/ps4';
import express from 'express';
import { ProjectorScreen } from './devices/projector-screen';
import { Projector } from './devices/projector';
import { gametime } from './commands/game-time';
import { worktime } from './commands/work-time';

const config = {
  knxbus: '192.168.1.167',
  projectorScreenAddress: '0/3/6',
  ps4Address: '192.168.1.70',
  games: {
    FIFA19: 'CUSA11599_0',
    FIFA20: 'CUSA15545',
  },
  ps4AuthToken: {
    'client-type': 'a',
    'auth-type': 'C',
    'user-credential': 'e1ffe9bff2cb1f3eec28d7868551d433877134dc7392b18e479b17eefddeb55b',
  },
  apiUrl: 'http://192.168.1.x/',
  screenPinUp: 2,
  screenPinDown: 3,

  port: 5000,
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function initKnx(): Promise<knx.Connection> {
  return new Promise((resolve, reject) => {
    const knxConnection = new knx.Connection({
      ipAddr: config.knxbus,
      handlers: {
        connected() {
          resolve(knxConnection);
        },
        error: reject,
        event: console.log,
      },
    });
  });
}

async function init() {
  const projectorScreen = new ProjectorScreen(config.projectorScreenAddress);
  const ps4 = new PS4(config.ps4Address, config.ps4AuthToken);
  const projector = new Projector();

  const app = express();

  app.use(async (req, res, next) => {
    (req as any).knx = await initKnx();
    const old = res.send;

    // @ts-ignore
    res.send = (body?: any) => {
      (req as any).knx.Disconnect();

      old.call(res, body);
    };

    return next();
  });

  app.post('/gametime', gametime(ps4, projectorScreen, projector, config.games));
  app.post('/worktime', worktime(ps4, projector, projectorScreen));

  app.post('/ps4', async (req, res) => {
    await ps4.turnOff();
    console.log('turned off', await ps4.detect());
    // await delay(5000);
    await ps4.turnOn();
    await ps4.startTitle(req.query.game);
    res.send(await ps4.detect());
  });

  app.listen(config.port);
}

init();
