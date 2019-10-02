import { PS4 } from '../devices/ps4';
import { Projector } from '../devices/projector';

import { ProjectorScreen } from '../devices/projector-screen';

export function worktime(ps4: PS4, projector: Projector, screen: ProjectorScreen) {
  return async (req, res) => {
    ps4.turnOff();
    projector.turnOff();

    screen.up(req.knx);

    res.send('work time!');
  };
}
