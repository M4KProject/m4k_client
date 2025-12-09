import { Css } from 'fluxio';
import { useProp } from '../BField';
import { Button, ButtonProps } from '@/components/common/Button';
import { Field } from '@/components/fields/Field';
import { BItem } from '@/components/box/bTypes';
import { BCalendar } from '../../../common/BCalendar';
import { useApi } from '@/hooks/useApi';

const c = Css('BSideFilter', {
  '': {
    col: ['stretch', 'start'],
    gap: 2,
  },
  DateRow: {
    row: 1,
    gap: 2,
  },
  DayButtons: {
    row: 1,
    gap: 1,
  },
  DayButton: {
    flex: 1,
    h: 35,
    center: 1,
  },
  'DayButton .ButtonContent': {
    rotate: '-45deg',
    fontSize: '80%',
  },
}); 

const DayButton = ({ day, active, ...props }: ButtonProps & { day: number; active?: boolean }) => (
  <Button {...props} {...c('DayButton')} class={active ? 'primary' : ''} />
);

const useFilterProp = <K extends keyof NonNullable<BItem['f']>>(
  prop: K
): [NonNullable<BItem['f']>[K] | undefined, (value: NonNullable<BItem['f']>[K]) => void] => {
  const [filter, setFilter] = useProp('f');
  const value = filter?.[prop];
  const setValue = (nextValue: NonNullable<BItem['f']>[K]) => {
    setFilter((prev) => ({ ...prev, [prop]: nextValue }));
  };
  return [value, setValue];
};

export const BSideFilter = () => {
  const api = useApi();
  const [dates, setDates] = useFilterProp('d');
  const [hours, setHours] = useFilterProp('h');
  const [weekDays, setWeekDays] = useFilterProp('w');

  const dateRange = dates?.[0] || ['', ''];
  const hourRange = hours?.[0] || [0, 24];

  const toggleDay = (dayIndex: number) => {
    const current = weekDays || [false, false, false, false, false, false, false];
    const next = [...current];
    next[dayIndex] = !current[dayIndex];
    setWeekDays(next as any);
  };

  return (
    <div {...c('')}>
      <Field label="Plage de dates" col>
        <BCalendar
          current={api.pb.getDate()}
          value={dateRange as [string, string]}
          onValue={(v) => setDates([v])}
        />
      </Field>

      <Field label="Plage horaire" col>
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
      </Field>

      <Field label="Jours de la semaine" col>
        <div {...c('DayButtons')}>
          <DayButton day={0} title="Dim." active={weekDays?.[0]} onClick={() => toggleDay(0)} />
          <DayButton day={1} title="Lun." active={weekDays?.[1]} onClick={() => toggleDay(1)} />
          <DayButton day={2} title="Mar." active={weekDays?.[2]} onClick={() => toggleDay(2)} />
          <DayButton day={3} title="Mer." active={weekDays?.[3]} onClick={() => toggleDay(3)} />
          <DayButton day={4} title="Jeu." active={weekDays?.[4]} onClick={() => toggleDay(4)} />
          <DayButton day={5} title="Ven." active={weekDays?.[5]} onClick={() => toggleDay(5)} />
          <DayButton day={6} title="Sam." active={weekDays?.[6]} onClick={() => toggleDay(6)} />
        </div>
      </Field>
    </div>
  );
};
