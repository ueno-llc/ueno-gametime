import * as knx from 'knx';
import { PS4 } from './devices/ps4';
import bodyParser from 'body-parser';
import express from 'express';
import { ProjectorScreen } from './devices/projector-screen';
import { Projector } from './devices/projector';
import { gametime } from './commands/game-time';
import { worktime } from './commands/work-time';

const config = {
  projectorSerialPath: '/dev/ttyS0',
  knxbus: '192.168.1.167',
  projectorScreenAddress: '0/3/6',
  ps4Address: undefined,
  games: {
    fifa19: 'CUSA11599_0',
    fifa20: 'CUSA15545',
    rocket: 'CUSA01433',
    fifa: '',
  },
  ps4AuthToken: {
    'client-type': 'a',
    'auth-type': 'C',
    'user-credential': process.env.PS4_AUTH_TOKEN,
  },
  port: 5000,
};

// alias games
config.games.fifa = config.games.fifa20;

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
  const ps4 = new PS4(config.ps4AuthToken, config.ps4Address);
  const projector = new Projector(config.projectorSerialPath);

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(async (req, res, next) => {
    (req as any).knx = await initKnx();

    return next();
  });

  app.post('/gametime', async (req: any, res) => {
    const game = (req.query.game || '').toLowerCase();

    if (!config.games[game]) {
      return res.status(400).send({ success: false, error: `Game "${game}" not found!` });
    }

    await gametime(ps4, projectorScreen, projector, game, req.knx);

    res.send({ success: true, time: 'gametime' });
  });

  app.post('/worktime', async (req: any, res) => {
    await worktime(ps4, projector, projectorScreen, req.knx);

    res.send({ success: true, time: 'worktime' });
  });

  app.post('/slack/command', async (req: any, res) => {
    let [command = '', ...params] = req.body.text.split(' ');

    if (command.length && params.length === 0) {
      // default to "ps4" command
      params[0] = command;
      command = 'ps4';
    }

    if (command === 'ps4') {
      const game = (params[0] || '').toLowerCase();
      if (config.games[game]) {
        await gametime(ps4, projectorScreen, projector, game, req.knx);

        return res.send(`It's gametime!`);
      } else {
        res.send(`Game "${game}" was not found`);
        return;
      }
    } else if (command === 'work') {
      await worktime(ps4, projector, projectorScreen, req.knx);

      return res.send("Its work o' clock!");
    }

    res.send(`Bleep Blob. Command "${command}" not recognized.`);
  });

  app.post('/ps4', async (req, res) => {
    await ps4.turnOff();
    console.log('turned off', await ps4.detect());
    // await delay(5000);
    await ps4.turnOn();
    await ps4.startTitle(req.query.game);
    res.send(await ps4.detect());
  });

  app.use(async (req: any, res, next) => {
    if (req.knx) {
      req.knx.Disconnect();
    }

    next();
  });

  app.listen(config.port);
}

init();
