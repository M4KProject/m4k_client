import { Css } from 'fluxio';

const c = Css('EditForm', {
  '': {
    flex: 2,
    fCol: 1,
    elevation: 1,
    m: 0.5,
  },
});

export const EditForm = () => {
  return <div {...c()}>FORM</div>;
};

// import { Css } from 'fluxio';

// const c = Css('EditButtons', {
//   '': {
//     fCol: 1,
//   },
// });

// export const EditButtons = () => {
//   return (
//     <div {...c()}>
//       TREE
//     </div>
//   );
// };
