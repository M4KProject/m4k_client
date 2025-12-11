import { bitsToRecord, Css, dayIndexToShort, recordToBits } from 'fluxio';
import { useProp } from '../BField';
import { Field } from '@/components/fields/Field';
import { BItem } from '@/components/box/bTypes';
import { Calendar } from '@/components/common/Calendar';
import { useApi } from '@/hooks/useApi';

const c = Css('BSideFilter', {
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

const WeekDaysField = () => {
  const [dates, setDates] = useFilterProp('w');
  const value = bitsToRecord(dates||0);

  return (
    <Field
      label="Jours de la semaine"
      col
      type="picker"
      items={[1,2,3,4,5,6,0].map(v => [v as any, dayIndexToShort(v)])}
      value={value}
      onValue={next => setDates(recordToBits(next))}
    />
  )
}

export const BSideFilter = () => {
  const api = useApi();
  const [dates, setDates] = useFilterProp('d');
  const [hours, setHours] = useFilterProp('h');

  const dateRange = dates?.[0] || ['', ''];
  const hourRange = hours?.[0] || [0, 24];

  return (
    <div {...c('')}>
      <Field label="Plage de dates" col>
        <Calendar />
      </Field>
      <WeekDaysField />
    </div>
  );
};
