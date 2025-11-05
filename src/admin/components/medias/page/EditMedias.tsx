import { Css } from 'fluxio';

const c = Css('EditMedias', {
  '': {
    flex: 1,
    col: 1,
    elevation: 1,
    m: 4,
  },
});

export const EditMedias = () => {
  return <div {...c()}>MEDIAS</div>;
};
