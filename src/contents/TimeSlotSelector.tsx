import { useCss, useMsg } from '@common/hooks';
import { Css, Msg, formatMs, toStr, toNbr, flexRow } from '@common/helpers';
import { Button, Field } from '@common/components';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { useState } from 'preact/hooks';

const css: Css = {
  '&': {
    ...flexRow({ align: 'center' }),
    p: 2,
    pointerEvents: 'auto',
  },
};

interface TimeSlotSelectorProps {
  times: number[];
  selectedTime$: Msg<number>;
}

export const TimeSlotSelector = ({ times, selectedTime$ }: TimeSlotSelectorProps) => {
  const c = useCss('TimeSlotSelector', css);
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedTime = useMsg(selectedTime$);
  
  return (
    <div className={c}>
      <Button icon={isOpen ? <MdMenuOpen /> : <MdMenu />} onClick={() => setIsOpen(o => !o)} />
      {isOpen && (
        <Field
          type="select"
          value={selectedTime}
          items={times.map(t => [toStr(t), formatMs(t * 1000)])}
          onValue={t => selectedTime$.set(toNbr(t))}
        />
      )}
    </div>
  );
};