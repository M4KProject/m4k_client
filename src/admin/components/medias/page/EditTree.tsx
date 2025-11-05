import { Css } from 'fluxio';

const c = Css('EditTree', {
  '': {
    flex: 1,
    col: 1,
    elevation: 1,
    m: 4,
  },
});

export const EditTree = () => {
  return <div {...c()}>TREE</div>;
};
