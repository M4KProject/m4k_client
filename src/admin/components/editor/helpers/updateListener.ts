import { B } from '../B';
import { addHistory } from './history';

export const setupUpdateListener = () => {
  B.update$.on(({ b, d }) => {
    console.debug('B.update$', b, d);
    if (!b) return;
    if (d) {
      if (b.d.children?.length === 0) delete b.d.children;
      addHistory();
    }
  });
};
