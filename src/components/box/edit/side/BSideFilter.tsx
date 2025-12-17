import { bitsToRecord, Css, dayIndexToShort, recordToBits, repeat } from 'fluxio';
import { useProp } from '../fields/BField';
import { Field, FieldCol, FieldRow } from '@/components/fields/Field';
import { BItem } from '@/components/box/bTypes';
import { Calendar } from '@/components/common/Calendar';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/common/Button';
import { PlusIcon, TrashIcon } from 'lucide-react';

const c = Css('BSideFilter', {
  TimeSlot: { row: ['center', 'between'], w: '100%' },
  'TimeSlot .Field': { w: 80 },
  WeekDay: {
    rotate: '-45deg',
    fontSize: '80%',
  },
});

const useFilterProp = <K extends keyof NonNullable<BItem['f']>>(
  prop: K
): [NonNullable<BItem['f']>[K] | undefined, (value: NonNullable<BItem['f']>[K]) => void] => {
  const [filter, setFilter] = useProp('f');
  const value = filter?.[prop];
  const setValue = (nextValue: NonNullable<BItem['f']>[K]) => {
    setFilter((prev) => ({ ...(prev || {}), [prop]: nextValue }));
  };
  return [value, setValue];
};

const WeekDay = ({ i }: { i: number }) => {
  const name = dayIndexToShort(i);
  return <span {...c('WeekDay')}>{name}</span>;
};

const WeekDaysField = () => {
  const [dates, setDates] = useFilterProp('w');
  const value = bitsToRecord(dates || 0);

  return (
    <Field
      label="Jours de la semaine"
      col
      type="picker"
      items={[1, 2, 3, 4, 5, 6, 0].map((v) => [v as any, () => <WeekDay i={v} />])}
      value={value}
      onValue={(next) => setDates(recordToBits(next))}
    />
  );
};

export const BSideFilter = () => {
  const api = useApi();
  const [dates, setDates] = useFilterProp('d');
  const [hours, setHours] = useFilterProp('h');

  const dateRange = dates?.[0] || ['', ''];
  const hourRange = hours?.[0] || [0, 24];

  return (
    <div {...c('')}>
      <Field label="Date d'affichage" col>
        <FieldCol>
          <Field label="Début" type="date" />
          <Field label="Fin" type="date" />
        </FieldCol>
      </Field>
      <Field label="Crenaux quotidien" col>
        <FieldRow>
          <Field type="time" />
          <Field type="time" />
        </FieldRow>
      </Field>
      <WeekDaysField />
      <Field label="Mots-clés" type="multiline" col />
    </div>
  );
};
