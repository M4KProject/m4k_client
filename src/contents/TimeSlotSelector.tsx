import { useCss } from '@common/hooks';
import { Css, dateToSeconds, secondsToTimeString } from '@common/helpers';
import { Field } from '@common/components';
import { useState, useEffect } from 'preact/hooks';
import { MdAccessTime } from 'react-icons/md';

const css: Css = {
  '&': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    pointerEvents: 'auto',
    position: 'relative',
    minWidth: '250px',
  },
};

interface TimeSlotEntry {
  language: string;
  url: string;
  title: string;
  startTime?: number; // Seconds since midnight
  endTime?: number; // Seconds since midnight
  duration?: number;
}

interface TimeSlotSelectorProps {
  languageEntries: TimeSlotEntry[];
  selectedTimeSlot: string;
  activeTimeSlot: string;
  onTimeSlotChange: (timeSlot: string) => void;
}

export const TimeSlotSelector = ({ 
  languageEntries, 
  selectedTimeSlot, 
  activeTimeSlot, 
  onTimeSlotChange 
}: TimeSlotSelectorProps) => {
  const c = useCss('TimeSlotSelector', css);
  
  // Get current time in seconds
  const getCurrentTimeString = () => {
    return secondsToTimeString(dateToSeconds(new Date()));
  };
  
  const [currentTime, setCurrentTime] = useState(() => getCurrentTimeString());
  
  // Create time slots - each entry gets its own slot
  const timeSlots: Record<string, TimeSlotEntry> = {};
  
  languageEntries.forEach((entry, index) => {
    const key = entry.startTime !== undefined && entry.endTime !== undefined 
      ? `${entry.startTime}-${entry.endTime}`
      : `entry-${index}`;
    timeSlots[key] = entry;
  });
  
  // Create select options
  const selectItems: [string, string][] = [
    ['auto', `Automatique (${currentTime})`],
    ...Object.keys(timeSlots).map((key): [string, string] => {
      const entry = timeSlots[key];
      let label = entry.title;
      
      // Add time range if available
      if (entry.startTime !== undefined && entry.endTime !== undefined) {
        const timeRange = `${secondsToTimeString(entry.startTime)} - ${secondsToTimeString(entry.endTime)}`;
        label = `${entry.title} (${timeRange})`;
      }
      
      return [key, label];
    })
  ];
  
  // Auto-refresh current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  if (selectItems.length <= 1) {
    return null;
  }
  
  return (
    <div className={c}>
      <Field
        type="select"
        label={<><MdAccessTime size={16} style={{ marginRight: '8px' }} />Plage horaire</>}
        value={selectedTimeSlot}
        items={selectItems}
        onValue={onTimeSlotChange}
      />
    </div>
  );
};