import { Css } from 'fluxio';
import { EditMedias } from './EditMedias';
import { EditTree } from './EditTree';
import { EditForm } from './EditForm';

const c = Css('EditSide', {
  '': {
    position: 'relative',
    elevation: 2,
    borderLeft: 'g3',
    p: 4,
    w: 250,
    bg: 'b0',
    zIndex: 10,
    col: 1,
  },
});

export const EditSide = () => {
  return (
    <div {...c()}>
      <EditMedias />
      <EditTree />
      <EditForm />
      {/* 
      <EdActions />
      <EdProps /> */}
    </div>
  );
};
