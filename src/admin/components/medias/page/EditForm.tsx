import { Css } from 'fluxio';

const c = Css('EditForm', {
  '': {
    fCol: 1,
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
