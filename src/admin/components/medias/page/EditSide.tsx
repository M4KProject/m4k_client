import { Css } from 'fluxio';
import { EditMedias } from './EditMedias';
import { EditTree } from './EditTree';
import { EditForm } from './EditForm';

const c = Css('EditSide', {
  '': {
    position: 'relative',
    elevation: 2,
    borderLeft: 'g3',
    p: 0.5,
    w: 20,
    bg: 'b0',
    zIndex: 10,
    fCol: 1,
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
