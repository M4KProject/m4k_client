import { B } from './B';
import { setupContentEditableProp } from './helpers/contentEditable';
import { setupSelectionListener } from './helpers/selection';
import { setupUpdateListener } from './helpers/updateListener';

export const setup = () => {
  setupContentEditableProp();
  setupSelectionListener();
  setupUpdateListener();

  B.importRoot({
    children: [
      {
        style: {
          position: 'absolute',
          left: '50px',
          top: '50px',
          width: '100px',
          height: '100px',
          background: 'red',
        },
      },
      {
        style: {
          position: 'absolute',
          left: '50px',
          top: '150px',
          width: '100px',
          height: '100px',
          background: 'blue',
        },
      },
    ],
  });
};
