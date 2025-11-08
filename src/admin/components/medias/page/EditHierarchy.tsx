import { Css } from 'fluxio';

const c = Css('EditHierarchy', {
  '': {
    flex: 1,
    col: 1,
    elevation: 1,
    m: 4,
  },
});

export const EditHierarchy = () => {
  return <div {...c()}>TREE</div>;
};
