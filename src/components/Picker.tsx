import { ComponentChildren } from 'preact';
import { Css } from 'fluxio';
import { Button } from './Button';
import { isArray } from 'fluxio';

const c = Css('Picker', {
  '': {
    row: ['center', 'center'],
    flexWrap: 'wrap',
    w: '100%',
    p: 0,
    border: 0,
  },
  ' .Button': {
    m: 0,
    p: 0,
    hMin: '1em',
  },
  ' .Button .ButtonIcon': {
    wh: '1em',
    bg: 'transparent',
  },
});

export interface PickerProps {
  class?: string;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  items?: ([string, ComponentChildren] | false | null | undefined)[];
  props?: any;
}

export const Picker = ({
  name,
  required,
  value = '',
  onChange,
  items = [],
  ...props
}: PickerProps) => {
  const validItems = items.filter((item) => isArray(item)) as [string, ComponentChildren][];

  const handleIconClick = (iconValue: string) => {
    onChange?.(iconValue);
  };

  return (
    <div {...props} {...c('', props)}>
      {/* Hidden input for form compatibility */}
      <input
        name={name}
        required={required}
        value={value}
        style={{ display: 'none' }}
        tabIndex={-1}
      />

      {validItems.map(([key, icon]) => (
        <Button
          key={key}
          icon={icon}
          selected={key === value}
          color={key === value ? 'primary' : undefined}
          onClick={() => handleIconClick(key)}
          // title={key} // Tooltip showing the key/value
        />
      ))}
    </div>
  );
};
