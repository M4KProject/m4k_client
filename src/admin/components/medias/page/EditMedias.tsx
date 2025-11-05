import { Css } from 'fluxio';

const c = Css('EditMedias', {
  '': {
    flex: 1,
    fCol: 1,
    elevation: 1,
    m: 0.5,
  },
});

export const EditMedias = () => {
  return <div {...c()}>MEDIAS</div>;
};
