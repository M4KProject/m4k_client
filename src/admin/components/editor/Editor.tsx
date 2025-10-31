import { EdFabs } from './EdFabs';
import { EdSide } from './EdSide';
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
    <div {...c()}>
      {/* <EdViewport /> */}
      {/* <EdTerminal /> */}
      <EdSide />
      <EdFabs />
    </div>
  );
};
