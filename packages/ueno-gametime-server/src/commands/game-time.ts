import { PS4 } from '../devices/ps4';
import { ProjectorScreen } from '../devices/projector-screen';
import { Projector } from '../devices/projector';
import { Connection } from 'knx';

type GamesDictionary = {
  [key: string]: string;
};

export async function gametime(
  ps4: PS4,
  projectorScreen: ProjectorScreen,
  projector: Projector,
  game: string,
  knx: Connection
) {
  projector.turnOn();

  await ps4.turnOn();
  await ps4.startTitle(game);
  await projectorScreen.down(knx);
}
