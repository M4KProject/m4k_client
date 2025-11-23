import { Css } from 'fluxio';
import { jsonStringify } from 'fluxio';
import { bridge, BridgeSignalEvent } from '@/bridge';
import { useEffect, useState } from 'preact/hooks';
import { Page, PageBody } from '@/components/common/Page';
import { Toolbar } from '@/components/common/Toolbar';

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
    <Page {...c()}>
      <Toolbar title="Liste des événements" />
      <PageBody>
        {events.map((e, i) => (
          <pre key={i}>{jsonStringify(e)}</pre>
        ))}
      </PageBody>
    </Page>
  );
};
