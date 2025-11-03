// import { EdFabs } from './EdFabs';
// import { EdSide } from './EdSide';
import { Css } from 'fluxio';
import { EdViewport } from './viewport/EdViewport';
import { setup } from './setup';
import { BEditorController } from './BEditorController';
import { useMemo } from 'preact/hooks';
// import { EdTerminal } from './EdTerminal';

const c = Css('Editor', {
  '': {
    position: 'relative',
    flex: 1,
    fCol: 1,
  },
});

setup();

export const Editor = () => {
  console.debug('Editor');

  const ctrl = useMemo(() => new BEditorController(), []);

  return (
    <div {...c()}>
      <EdViewport ctrl={ctrl} />
      {/* <EdTerminal />
      <EdSide />
      <EdFabs /> */}
    </div>
  );
};
