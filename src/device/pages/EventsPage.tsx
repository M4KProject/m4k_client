import { Page, Toolbar, PageBody } from '@common/components';
import { Css } from '@common/ui';
import { stringify } from '@common/utils';
import { m4k, M4kSignalEvent } from '@common/m4k';
import { useEffect, useState } from 'preact/hooks';

const c = Css('EventsPage', {
  ' pre': {
    p: 0,
    m: 0.2,
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
    <Page class={c()}>
      <Toolbar title="Liste des événements" />
      <PageBody>
        {events.map((e, i) => (
          <pre key={i}>{stringify(e)}</pre>
        ))}
      </PageBody>
    </Page>
  );
};
