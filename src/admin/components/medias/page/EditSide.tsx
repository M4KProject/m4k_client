import { Css } from 'fluxio';
import { EditTree } from './EditTree';
import { EditForm } from './EditForm';

const c = Css('EditSide', {
  '': {
    position: 'relative',
    elevation: 3,
    w: 20,
    bg: 'b0',
    zIndex: 10,
    fCol: 1,
  },
});

export const EditSide = () => {
  return (
    <div {...c()}>
      <EditTree />
      <EditForm />
      {/* 
      <EdActions />
      <EdProps /> */}
    </div>
  );
};
