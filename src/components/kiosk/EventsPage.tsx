import { Css } from 'fluxio';
import { jsonStringify } from 'fluxio';
import { bridge, BridgeSignalEvent } from '@/bridge';
import { useEffect, useState } from 'preact/hooks';
import { Page } from '../pages/base/Page';
import { Panel } from '../panels/base/Panel';

const c = Css('EventsPage', {
  ' pre': {
    p: 0,
    m: 2,
  },
});

export const EventsPage = () => {
  const [events, setEvents] = useState<BridgeSignalEvent[]>([]);

  useEffect(() => {
    if (!bridge) return;
    return bridge.subscribe((event) => {
      setEvents((events) => {
        const next = [...events, event];
        if (next.length > 30) next.splice(0, next.length - 30);
        return next;
      });
    });
  }, [bridge]);

  return (
    <Page {...c('')}>
      <Panel icon={null} title="Liste des événements">
        {events.map((e, i) => (
          <pre key={i}>{jsonStringify(e)}</pre>
        ))}
      </Panel>
    </Page>
  );
};
