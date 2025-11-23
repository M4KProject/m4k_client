import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { Css } from 'fluxio';
import { Button } from './Button';

const c = Css('TabPanel', {
  '': {
    col: 1,
  },

  Tabs: {
    row: ['center', 'start'],
    bb: 'bg',
    bg: 'bg',
  },

  Content: {
    col: 1,
    flex: 1,
    overflow: 'auto',
  },
});

export type TabItem = [string, JSX.Element];

export interface TabPanelProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  tabs: TabItem[];
}

export const TabPanel = ({ tabs, ...props }: TabPanelProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div {...props} {...c('', props)}>
      <div {...c('Tabs')}>
        {tabs.map(([label], index) => (
          <Button
            key={index}
            selected={activeTab === index}
            onClick={() => setActiveTab(index)}
            {...c('Tab', activeTab === index && 'Tab-selected')}
          >
            {label}
          </Button>
        ))}
      </div>
      <div {...c('Content')}>{tabs[activeTab]?.[1]}</div>
    </div>
  );
};
