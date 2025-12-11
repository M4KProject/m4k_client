import { ComponentChildren } from 'preact';
import { Css, Dictionary, isDictionary } from 'fluxio';
import { Button } from '@/components/common/Button';
import { isArray } from 'fluxio';
import { useFieldController, useFieldState } from '@/components/fields/hooks';
import { FieldProps } from '@/components/fields/types';

const c = Css('Picker', {
  '': {
    w: '100%',
    rowWrap: 1,
  },
  ' .Button': {
    flex: 1,
    h: 38,
    m: 0,
    p: 0,
    border: 'border',
    br: 0,
    center: 1,
    rounded: 0,
  },
  ' .Button:first-child': { rounded: [5, 0, 0, 5] },
  ' .Button:last-child': { rounded: [0, 5, 5, 0], br: 1 },
  ' .ButtonContent': {
    rotate: '-45deg',
    fontSize: '80%',
  },
  // '': {
  //   row: ['center', 'center'],
  //   flexWrap: 'wrap',
  //   w: '100%',
  //   p: 0,
  //   border: 0,
  // },
  // ' .Button': {
  //   m: 0,
  //   p: 0,
  //   hMin: '1em',
  // },
  // ' .Button .ButtonIcon': {
  //   wh: '1em',
  //   bg: 'transparent',
  // },
});

interface PickerProps {
  class?: any;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  items?: ([string, ComponentChildren] | false | null | undefined)[];
  props?: any;
}

// const Picker = ({
//   name,
//   required,
//   value = '',
//   onChange,
//   items = [],
//   ...props
// }: PickerProps) => {
//   const handleIconClick = (iconValue: string) => {
//     onChange?.(iconValue);
//   };

//   return (
//     <div {...props} {...c('', props)}>
//       {/* Hidden input for form compatibility */}
//       <input
//         name={name}
//         required={required}
//         value={value}
//         style={{ display: 'none' }}
//         tabIndex={-1}
//       />

//       {validItems.map(([key, icon]) => (
//         <Button
//           key={key}
//           icon={icon}
//           selected={key === value}
//           color={key === value ? 'primary' : undefined}
//           onClick={() => handleIconClick(key)}
//           // title={key} // Tooltip showing the key/value
//         />
//       ))}
//     </div>
//   );
// };

// const PickerInput = () => {
//   const ctrl = useFieldController();
//   const { config, value } = useFieldState(ctrl, 'config', 'value');

//   return (
//     <Picker
//       items={config.items}
//       value={value}
//       onChange={ctrl.onChange}
//       name={config.name}
//       required={config.required}
//     />
//   );
// };

const Picker = () => {
  const controller = useFieldController();
  const { config, raw } = useFieldState(controller, 'config', 'raw');
  const props = config.props;
  const values: Dictionary<1> = isDictionary(raw) ? raw : {};

  const isSelected = (index: any) => !!values[index];

  const getHandle = (index: any) => () => {
    const next = {...values};
    if (next[index]) delete next[index];
    else next[index] = 1;
    controller.update({ raw: next });
  }

  return (
    <div {...props} {...c('', props)}>
      {config.items?.map((item) => isArray(item) ? (
        <Button
          key={item[0]}
          selected={isSelected(item[0])}
          onClick={getHandle(item[0])}
        >
          {item[1]}
        </Button>
      ) : null)}
    </div>
  );
};

const picker: FieldProps<any, string> = {
  input: Picker,
  delay: 10,
};

export const pickerInputs = {
  picker,
};
