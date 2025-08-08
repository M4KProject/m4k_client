import { useCss } from '@common/hooks';
import { Css, flexColumn, dateToSeconds } from '@common/helpers';
import { Div } from '@common/components';
import { useState } from 'preact/hooks';
import type { ContentProps } from './ContentViewer';
import { mediaColl, PlaylistContentModel } from '@common/api';
import { PDFViewer } from './PDFViewer';
import { TimeSlotSelector } from './TimeSlotSelector';
import { LanguageFlags } from './LanguageFlags';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    wMin: '100vw',
    hMin: '100vh',
    position: 'relative',
  },
  '&TopControls': {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
    pointerEvents: 'none',
  },
  '&PDFContainer': {
    flex: 1,
    position: 'relative',
    height: '100vh',
  },
};

export const PlaylistContent = ({ content, medias }: ContentProps<PlaylistContentModel>) => {
  const c = useCss('PlaylistContent', css);
  console.debug('PlaylistContent', content, content.data.items);

  const [currentLanguage, setCurrentLanguage] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('auto');

  // Create all language entries (all items, not just first per language)
  const languageEntries = content.data.items.map((item) => {
    const mediaId = item.media;
    const media = medias.find(m => m.id === mediaId);
    const mediaUrl = mediaColl.getUrl(mediaId, media.file);
    
    return {
      language: item.language || 'default',
      url: mediaUrl,
      title: item.title,
      startTime: item.startTime,
      endTime: item.endTime,
      duration: item.duration
    };
  });

  // Set initial language if not set
  if (!currentLanguage && languageEntries.length > 0) {
    setCurrentLanguage(languageEntries[0].language);
  }

  // Get current language entries for time slot selection
  const currentLanguageEntries = languageEntries.filter(entry => entry.language === currentLanguage);

  // Create time slots for auto-selection
  const timeSlots: Record<string, typeof languageEntries[0]> = {};
  currentLanguageEntries.forEach((entry, index) => {
    const key = entry.startTime !== undefined && entry.endTime !== undefined 
      ? `${entry.startTime}-${entry.endTime}`
      : `entry-${index}`;
    timeSlots[key] = entry;
  });

  // Auto-select based on current time
  const getCurrentTimeSlot = (): string => {
    const currentTimeSeconds = dateToSeconds(new Date());
    
    for (const [key, entry] of Object.entries(timeSlots)) {
      if (entry.startTime !== undefined && entry.endTime !== undefined && 
          currentTimeSeconds >= entry.startTime && currentTimeSeconds <= entry.endTime) {
        return key;
      }
    }
    return Object.keys(timeSlots)[0] || 'default';
  };

  const activeTimeSlot = selectedTimeSlot === 'auto' ? getCurrentTimeSlot() : selectedTimeSlot;
  const currentEntry = timeSlots[activeTimeSlot] || Object.values(timeSlots)[0];

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    setSelectedTimeSlot('auto'); // Reset to auto when changing language
  };

  const handleTimeSlotChange = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}TopControls`}>
        <TimeSlotSelector
          languageEntries={currentLanguageEntries}
          selectedTimeSlot={selectedTimeSlot}
          activeTimeSlot={activeTimeSlot}
          onTimeSlotChange={handleTimeSlotChange}
        />
        
        <LanguageFlags
          languageEntries={languageEntries}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </Div>
      
      {currentEntry && (
        <Div cls={`${c}PDFContainer`}>
          <PDFViewer url={currentEntry.url} />
        </Div>
      )}
    </Div>
  );
};