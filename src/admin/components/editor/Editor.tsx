import EdViewport from './EdViewport';
import EdFabs from './EdFabs';
import EdTerminal from './EdTerminal';
import EdSide from './EdSide';
import { Css } from '@common/ui';

const c = Css('Editor', {
  '': {
    flex: 1,
    fCol: [],
  },
});

export const Editor = () => {
  console.debug('Editor');

  return (
    <div class={c('')}>
      <EdViewport />
      <EdTerminal />
      <EdSide />
      <EdFabs />
    </div>
  );
}
