import { bitsToRecord, Css, dayIndexToShort, recordToBits, repeat } from 'fluxio';
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

// const HoursField = () => {
//   const [hours, setHours] = useFilterProp('h');

//   return (
//     <Field label="Horaires" col>
//       <Field
//         type="picker"
//         items={repeat(24, i => i+1).map(h => [h as any, h])}
//         value={hours}
//         onValue={next => {}}
//       />
//     </Field>
//   )
// }

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
      <Field label="Date Début" type="date" col />
      <Field label="Date Fin" type="date" col />
      <Field label="Heure Début" type="seconds" col />
      <Field label="Heure Fin" type="seconds" col />
      {/* <HoursField /> */}
      <WeekDaysField />
    </div>
  );
};
