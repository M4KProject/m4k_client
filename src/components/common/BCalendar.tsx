import { Css, getMonth, getYear, repeat, serverDate } from 'fluxio';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/fields/Field';
import { useState } from 'preact/hooks';

const DAY_WIDTH = 30;

const c = Css('BCalendar', {
  '': {
    col: ['stretch', 'center'],
    gap: 2,
  },
  Header: {
    row: ['stretch', 'center'],
    gap: 2,
  },
  WeekDays: {
    row: ['stretch', 'center'],
    gap: 1,
    mb: 1,
  },
  WeekDay: {
    flex: 1,
    center: 1,
    fontSize: 0.75,
    fg: 'textSecondary',
    h: 30,
  },
  Days: {
    w: DAY_WIDTH * 7,
    rowWrap: 1,
  },
  Day: {
    w: DAY_WIDTH,
    h: 35,
    center: 1,
    fontSize: 0.85,
  },
  EmptyDay: {
    w: 'calc((100% - 6px) / 7)',
    h: 35,
  },
});

interface BCalendarProps {
  now?: Date;
  value?: Date;
  onValue?: (value: Date) => void;
}

export const BCalendar = ({ value, onValue }: BCalendarProps) => {
  if (!value) value = serverDate();

  const year = getYear(value);
  const month = getMonth(value);

  const start = value;
  const end = value;

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const formatDate = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const isSelected = (year: number, month: number, day: number) => {
    const date = formatDate(year, month, day);
    if (!startDateObj) return false;
    if (!endDateObj) return date === startDate;
    return date >= startDate && date <= endDate;
  };

  const handleDayClick = (day: number) => {
    const clickedDate = formatDate(year, month, day);

    if (!startDateObj || (startDateObj && endDateObj)) {
      onValue?.([clickedDate, clickedDate]);
    } else {
      if (clickedDate < startDate) {
        onValue?.([clickedDate, startDate]);
      } else {
        onValue?.([startDate, clickedDate]);
      }
    }
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const years = repeat(10, (i) => 2025 + i).map((y) => [y, String(y)] as [number, string]);
  const months = MONTHS.map((name, index) => [index, name] as [number, string]);

  return (
    <div {...c('')}>
      <div {...c('Header')}>
        <Field type="select" value={month} onValue={setMonth} items={months} />
        <Field type="select" value={year} onValue={setYear} items={years} />
      </div>

      <div {...c('WeekDays')}>
        {WEEK_DAYS.map((day) => (
          <div key={day} {...c('WeekDay')}>
            {day}
          </div>
        ))}
      </div>

      <div {...c('Days')}>
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} {...c('EmptyDay')} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const selected = isSelected(year, month, day);
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              {...c('Day', selected && 'Day-selected')}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
