import { Css, isFunction, NextState, SetState } from 'fluxio';
import { useBoxCtrl } from './box/BoxCtrl';
import { Field, FieldProps } from '@/components/Field';
import { useTr } from '@/hooks/useTr';
import { Tr } from '@/components/Tr';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { BoxData } from './box/boxTypes';

const c = Css('EditProps', {
  '': {
    flex: 2,
    col: 1,
    elevation: 1,
    m: 4,
  },
});

const useProp = <K extends keyof BoxData>(
  prop: K
): [BoxData[K] | undefined, SetState<BoxData[K]>] => {
  const ctrl = useBoxCtrl();
  const id = useFlux(ctrl.click$).id;
  const value = useFluxMemo(() => ctrl.getProp$(id, prop), [id, prop]);
  return [value, (next: NextState<BoxData[K]>) => ctrl.setProp(id, prop, next)];
};

export const EditProp = ({ prop, ...props }: FieldProps & { prop: keyof BoxData }) => {
  const [value, setValue] = useProp(prop);
  return <Field name={prop} label="Type" value={value} onValue={setValue} {...props} />;
};

export const EditProps = () => {
  const ctrl = useBoxCtrl();
  const select = useFlux(ctrl.click$);
  const id = select.id;
  const box = select.box;
  const types = Object.keys(ctrl.registry);
  const [type] = useProp('type');

  return id && box ?
      <div {...c()}>
        <EditProp
          prop="type"
          label="Type"
          type="select"
          items={types.map((type) => [type, <Tr>{type}</Tr>])}
        />
        content : uniquement bold : "Mon Texte **Hello** !" l'alignement ce fait via le align flex
      </div>
    : null;
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
