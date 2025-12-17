import {
  addDay,
  Css,
  DAY,
  endOfMonth,
  endOfWeek,
  floor,
  formatDate,
  cloneDate,
  getMonth,
  getMonthDay,
  getTime,
  getYear,
  isDate,
  MONTH_NAMES,
  repeat,
  serverDate,
  setMonth,
  setMonthDay,
  setYear,
  startOfMonth,
  startOfWeek,
  toString,
  DAY_SHORTS,
  dayIndexToShort,
  normalizeIndex,
} from 'fluxio';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/fields/Field';
import { useState } from 'preact/hooks';

const DAY_WIDTH = 30;

const c = Css('Calendar', {
  '': {
    w: '100%',
    rowWrap: 1,
  },
  Day: { w: 45 },
  Month: { w: 110 },
  Year: { w: 65 },

  Title: { wMin: '14%', wMax: '14%', center: 1 },
  Btn: { wMin: '14%', wMax: '14%' },

  // WeekDays: {
  //   row: ['stretch', 'center'],
  //   gap: 1,
  //   mb: 1,
  // },
  // WeekDay: {
  //   flex: 1,
  //   center: 1,
  //   fontSize: 0.75,
  //   fg: 'textSecondary',
  //   h: 30,
  // },
  // Day: {
  //   w: DAY_WIDTH,
  //   h: 35,
  //   center: 1,
  //   fontSize: 0.85,
  // },
  // EmptyDay: {
  //   w: 'calc((100% - 6px) / 7)',
  //   h: 35,
  // },
});

interface CalendarProps {
  now?: Date;
  value?: Date;
  onValue?: (value: Date) => void;
}

export const Calendar = ({}: CalendarProps) => {
  const [value, setValue] = useState(() => serverDate());

  const day = getMonthDay(value);
  const month = getMonth(value);
  const year = getYear(value);

  const monthStart = startOfMonth(value);
  const monthEnd = endOfMonth(value);

  const start = startOfWeek(monthStart);
  const end = endOfWeek(monthEnd);

  const monthDaysCount = getMonthDay(monthEnd);
  const daysCount = floor((getTime(end) - getTime(start)) / DAY);

  console.debug('Calendar', { day, month, year, start, end, monthDaysCount, daysCount });

  return (
    <div {...c('')}>
      <Field
        containerProps={c('Day')}
        type="select"
        value={day}
        onValue={(v) => setValue((d) => setMonthDay(d, v))}
        items={repeat(monthDaysCount, (i) => i + 1).map((d) => [d, d])}
      />
      <Field
        containerProps={c('Month')}
        type="select"
        value={month}
        onValue={(v) => setValue((d) => setMonth(d, v))}
        items={MONTH_NAMES.map((name, index) => [index, name])}
      />
      <Field
        containerProps={c('Year')}
        type="select"
        value={year}
        onValue={(v) => setValue((d) => setYear(d, v))}
        items={[year - 2, year - 1, year, year + 1, year + 2].map((y) => [y, y])}
      />
      {/* {repeat(7, i => dayIndexToShort(normalizeIndex(i+1, 7))).map(name => (
        <div {...c('Title')}><span>{name}</span></div>
      ))}
      {repeat(daysCount, i => addDay(cloneDate(start), i)).map(date => (
        <Button {...c('Btn')} title={toString(getMonthDay(date))} />
      ))}
      Calendar
      <div>{formatDate(value)}</div>
      <div>{formatDate(start)}</div>
      <div>{formatDate(end)}</div>
      <div>{daysCount}</div> */}
    </div>
  );

  // const getDaysInMonth = (year: number, month: number) => {
  //   return new Date(year, month + 1, 0).getDate();
  // };

  // const getFirstDayOfMonth = (year: number, month: number) => {
  //   const day = new Date(year, month, 1).getDay();
  //   return day === 0 ? 6 : day - 1;
  // };

  // const formatDate = (year: number, month: number, day: number) => {
  //   const m = String(month + 1).padStart(2, '0');
  //   const d = String(day).padStart(2, '0');
  //   return `${year}-${m}-${d}`;
  // };

  // const isSelected = (year: number, month: number, day: number) => {
  //   const date = formatDate(year, month, day);
  //   if (!startDateObj) return false;
  //   if (!endDateObj) return date === startDate;
  //   return date >= startDate && date <= endDate;
  // };

  // const handleDayClick = (day: number) => {
  //   const clickedDate = formatDate(year, month, day);

  //   if (!startDateObj || (startDateObj && endDateObj)) {
  //     onValue?.([clickedDate, clickedDate]);
  //   } else {
  //     if (clickedDate < startDate) {
  //       onValue?.([clickedDate, startDate]);
  //     } else {
  //       onValue?.([startDate, clickedDate]);
  //     }
  //   }
  // };

  // const daysInMonth = getDaysInMonth(year, month);
  // const firstDay = getFirstDayOfMonth(year, month);

  // const years = repeat(10, (i) => 2025 + i).map((y) => [y, String(y)] as [number, string]);
  // const months = MONTHS.map((name, index) => [index, name] as [number, string]);

  // return (
  //   <div {...c('')}>

  //     <div {...c('WeekDays')}>
  //       {WEEK_DAYS.map((day) => (
  //         <div key={day} {...c('WeekDay')}>
  //           {day}
  //         </div>
  //       ))}
  //     </div>

  //     <div {...c('Days')}>
  //       {Array.from({ length: firstDay }, (_, i) => (
  //         <div key={`empty-${i}`} {...c('EmptyDay')} />
  //       ))}
  //       {Array.from({ length: daysInMonth }, (_, i) => {
  //         const day = i + 1;
  //         const selected = isSelected(year, month, day);
  //         return (
  //           <div
  //             key={day}
  //             onClick={() => handleDayClick(day)}
  //             {...c('Day', selected && 'Day-selected')}
  //           >
  //             {day}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
};
