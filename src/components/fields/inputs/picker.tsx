import { Css, Dictionary, isDictionary } from 'fluxio';
import { Button } from '@/components/common/Button';
import { isArray } from 'fluxio';
import { useFieldController, useFieldState } from '@/components/fields/hooks';
import { FieldProps } from '@/components/fields/types';
import { comp } from '@/utils/comp';

const c = Css('Picker', {
  '': { w: '100%', rowWrap: 1 },
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
});

const Picker = () => {
  const controller = useFieldController();
  const { config, raw } = useFieldState(controller, 'config', 'raw');
  const props = config.props;
  const values: Dictionary<1> = isDictionary(raw) ? raw : {};

  const isSelected = (index: any) => !!values[index];

  const getHandle = (index: any) => () => {
    const next = { ...values };
    if (next[index]) delete next[index];
    else next[index] = 1;
    controller.update({ raw: next });
  };

  return (
    <div {...props} {...c('', props)}>
      {config.items?.map((item) =>
        isArray(item) ?
          <Button key={item[0]} selected={isSelected(item[0])} onClick={getHandle(item[0])}>
            {comp(item[1])}
          </Button>
        : null
      )}
    </div>
  );
};

const picker: FieldProps<any, string> = { input: Picker, delay: 10 };

export const pickerInputs = { picker };
