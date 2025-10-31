import { useFlux } from '@common/hooks';
import { panel$ } from './flux';
import { Css } from '@common/ui';
import { EdProps } from './EdProps';
import { EdActions } from './EdActions';
import EdTree from './EdTree';

const c = Css('EdEdSideitor', {
  '': {
    background: '#FFF',
    width: '350px',
    maxWidth: '350px',
    height: '100%',
    maxHeight: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    borderTop: '1px solid grey',
    zIndex: 10000,
  },
  // '& .Props': {
  //   p: 0.5,
  //   // alignItems: 'stretch',
  //   // flexDirection: 'column',
  // },
  // '& .Prop .PLabel': {
  //   width: 95,
  //   fontSize: '72%',
  //   justifyContent: 'flex-start',
  // },
  // '& .Prop .PRemove svg': {
  //   width: '0.8em',
  //   height: '0.8em',
  // },
  // '& .Action .ActionRow': {
  //   display: 'none',
  // },
  // '& .Action .ActionRow-primary': {
  //   display: 'flex',
  // },
});

export const EdSide = () => {
  const panel = useFlux(panel$);
  if (panel !== 'side') return null;
  return (
    <div {...c()}>
      {/* <EdTree />
      <EdActions />
      <EdProps /> */}
    </div>
  );
};
