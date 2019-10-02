import { PS4 } from '../devices/ps4';
import { Projector } from '../devices/projector';

import { ProjectorScreen } from '../devices/projector-screen';
import { Connection } from 'knx';

export async function worktime(
  ps4: PS4,
  projector: Projector,
  screen: ProjectorScreen,
  knx: Connection
) {
  ps4.turnOff();
  projector.turnOff();
  screen.up(knx);
}
