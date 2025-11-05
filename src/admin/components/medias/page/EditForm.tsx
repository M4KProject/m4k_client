import { Css } from 'fluxio';

const c = Css('EditForm', {
  '': {
    flex: 2,
    col: 1,
    elevation: 1,
    m: 4,
  },
});

export const EditForm = () => {
  return <div {...c()}>FORM</div>;
};

// import { Css } from 'fluxio';

// const c = Css('EditButtons', {
//   '': {
//     col: 1,
//   },
// });

// export const EditButtons = () => {
//   return (
//     <div {...c()}>
//       TREE
//     </div>
//   );
// };
