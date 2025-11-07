import { Css } from 'fluxio';
import { jsonStringify } from 'fluxio';
import { m4k, M4kSignalEvent } from '@/m4kBridge';
import { useEffect, useState } from 'preact/hooks';
import { Page, PageBody } from '@/components/Page';
import { Toolbar } from '@/components/Toolbar';

const c = Css('EventsPage', {
  ' pre': {
    p: 0,
    m: 2,
  },
});

export const EventsPage = () => {
  const [events, setEvents] = useState<M4kSignalEvent[]>([]);

  useEffect(() => {
    if (!m4k) return;
    return m4k.subscribe((event) => {
      setEvents((events) => {
        const next = [...events, event];
        if (next.length > 30) next.splice(0, next.length - 30);
        return next;
      });
    });
  }, [m4k]);

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
