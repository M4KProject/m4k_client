import { useCss } from '@common/hooks';
import { Page, PageHeader, PageBody } from '@common/components';
import { Css, stringify } from '@common/utils';
import { m4k, M4kSignalEvent } from '@common/m4k';
import { useEffect, useState } from 'preact/hooks';

const css: Css = {
  '&': {
    // flex: 1,
    // position: 'absolute',
    // inset: 0,
    // overflowX: 'auto',
    // overflowY: 'auto',
  },
  '& pre': {
    p: 0,
    m: 0.2,
    fontSize: 0.8,
  },
};

export const EventsPage = () => {
  const c = useCss('EventsPage', css);
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
    <Page cls={c}>
      <PageHeader title="Liste des événements" />
      <PageBody>
        {events.map((e, i) => (
          <pre key={i}>{stringify(e)}</pre>
        ))}
      </PageBody>
    </Page>
  );
};
