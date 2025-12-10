import { bitsToArray, Css, dayIndexToShort, firstUpper, getBit, repeat, setBit, toArray, toFalse, VECTOR3_ZERO } from 'fluxio';
import { useProp } from '../BField';
import { Button, ButtonProps } from '@/components/common/Button';
import { Field } from '@/components/fields/Field';
import { BItem } from '@/components/box/bTypes';
import { BCalendar } from '../../../common/BCalendar';
import { useApi } from '@/hooks/useApi';
import { useBEditController } from '../useBEditController';

const c = Css('BSideFilter', {
  '': {
    col: ['stretch', 'start'],
    gap: 2,
  },
  DateRow: {
    row: 1,
    gap: 2,
  },
  Day: {
    flex: 1,
    h: 38,
    m: 0,
    ml: -1,
    p: 0,
    border: 'border',
    center: 1,
    rounded: 0,
  },
  'Day:first-child': { rounded: [5, 0, 0, 5] },
  'Day:last-child': { rounded: [0, 5, 5, 0] },
  'Day .ButtonContent': {
    rotate: '-45deg',
    fontSize: '80%',
  },
});

const DayButton = ({ day, ...props}: ButtonProps & { day: number }) => {
  const controller = useBEditController()!;
  const [bits, setBits] = useFilterProp('w');
  const selected = getBit(bits||0, day);
  console.debug('DayButton', bits, day, selected);
  return (
    <Button
      title={firstUpper(dayIndexToShort(day))}
      selected={selected}
      onClick={() => {
        const prevBits = bits||0;
        const prevItem = getBit(prevBits, day);
        const nextItem = !prevItem;
        const nextBits = setBit(prevBits, day, nextItem);
        console.debug('day setBits', day, prevBits, prevItem, nextItem, nextBits);
        setBits(nextBits);
      }}
      {...props}
      {...c('Day', props)}
    />
  )
};

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

export const BSideFilter = () => {
  const api = useApi();
  const [dates, setDates] = useFilterProp('d');
  const [hours, setHours] = useFilterProp('h');

  const dateRange = dates?.[0] || ['', ''];
  const hourRange = hours?.[0] || [0, 24];

  // const toggleDay = (dayIndex: number) => {
  //   const current = weekDays || [false, false, false, false, false, false, false];
  //   const next = [...current];
  //   next[dayIndex] = !current[dayIndex];
  //   setWeekDays(next as any);
  // };

  return (
    <div {...c('')}>
      <Field label="Plage de dates" col>
        <BCalendar />
      </Field>

      {/* <Field label="Plage horaire" col>
        <div {...c('DateRow')}>
          <Field
            label="Début"
            type="number"
            min={0}
            max={24}
            value={hourRange[0]}
            onValue={(v) => setHours([[v, hourRange[1]]])}
          />
          <Field
            label="Fin"
            type="number"
            min={0}
            max={24}
            value={hourRange[1]}
            onValue={(v) => setHours([[hourRange[0], v]])}
          />
        </div>
      </Field> */}

      <Field label="Jours de la semaine" col>
        <DayButton day={1} />
        <DayButton day={2} />
        <DayButton day={3} />
        <DayButton day={4} />
        <DayButton day={5} />
        <DayButton day={6} />
        <DayButton day={0} />
      </Field>
    </div>
  );
};
