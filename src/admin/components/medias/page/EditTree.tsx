import { Css } from 'fluxio';

const c = Css('EditTree', {
  '': {
    h: 20,
    fCol: 1,
  },
});

export const EditTree = () => {
  return <div {...c()}>TREE</div>;
};
