import { PS4 } from '../devices/ps4';
import { ProjectorScreen } from '../devices/projector-screen';
import { Projector } from '../devices/projector';

type GamesDictionary = {
  [key: string]: string;
};

export function gametime(
  ps4: PS4,
  projectorScreen: ProjectorScreen,
  projector: Projector,
  games: GamesDictionary
) {
  return async (req, res) => {
    console.log('gametime!');
    const game = games[req.query.game] ? games[req.query.game] : games.FIFA19;

    projector.turnOn();

    await ps4.turnOn();
    await ps4.startTitle(game);
    await projectorScreen.down(req.knx);

    res.send('Game on!');
  };
}
