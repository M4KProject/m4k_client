import { useCss } from '@common/hooks';
import { Css, dateToSeconds, secondsToTimeString } from '@common/helpers';
import { Div } from '@common/components';
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
  },
  '&Button': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  '&Dropdown': {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '5px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minWidth: '250px',
    maxWidth: '350px',
    overflow: 'hidden',
    zIndex: 20,
  },
  '&Option': {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
    color: '#333',
  },
  '&Option:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&Option:last-child': {
    borderBottom: 'none',
  },
  '&Option.active': {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    fontWeight: 'bold',
  },
  '&Option.current': {
    fontWeight: 'bold',
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get current time in seconds
  const getCurrentTimeSeconds = () => {
    return dateToSeconds(new Date());
  };
  
  const getCurrentTimeString = () => {
    return secondsToTimeString(getCurrentTimeSeconds());
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
  
  // Add 'auto' option with current time
  const timeSlotOptions = {
    'auto': `Automatique (${currentTime})`,
    ...Object.keys(timeSlots).reduce((opts, key) => {
      const entry = timeSlots[key];
      opts[key] = entry.title;
      return opts;
    }, {} as Record<string, string>)
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleTimeSlotChange = (timeSlot: string) => {
    onTimeSlotChange(timeSlot);
    setIsDropdownOpen(false);
  };
  
  const getCurrentTimeSlotLabel = (): string => {
    if (selectedTimeSlot === 'auto') {
      return `Automatique (${currentTime})`;
    }
    return timeSlotOptions[selectedTimeSlot] || 'Automatique';
  };
  
  // Auto-refresh current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`[data-dropdown="timeslot"]`)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);
  
  if (Object.keys(timeSlotOptions).length <= 1) {
    return null;
  }
  
  return (
    <Div cls={`${c}`} data-dropdown="timeslot">
      <button 
        className={`${c}Button`}
        onClick={toggleDropdown}
      >
        <MdAccessTime size={16} />
        <span>Plage horaire : {getCurrentTimeSlotLabel()}</span>
      </button>
      
      {isDropdownOpen && (
        <Div cls={`${c}Dropdown`}>
          {Object.entries(timeSlotOptions).map(([key, label]) => {
            const isActive = key === selectedTimeSlot;
            const isCurrent = key === activeTimeSlot && selectedTimeSlot === 'auto';
            const className = `${c}Option ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`;
            
            return (
              <div
                key={key}
                className={className}
                onClick={() => handleTimeSlotChange(key)}
              >
                {label}
                {key !== 'auto' && timeSlots[key]?.startTime !== undefined && timeSlots[key]?.endTime !== undefined && (
                  <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>
                    {secondsToTimeString(timeSlots[key].startTime!)} - {secondsToTimeString(timeSlots[key].endTime!)}
                  </div>
                )}
              </div>
            );
          })}
        </Div>
      )}
    </Div>
  );
};