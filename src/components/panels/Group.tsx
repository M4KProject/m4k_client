import { Field } from '@/components/fields/Field';
import { Css } from 'fluxio';
import { useFluxMemo } from '@/hooks/useFlux';
import { Panel } from './base/Panel';
import { api2, MGroup } from '@/api2';
import { useRouter } from '@/hooks/useRoute';

const c = Css('Group', {
  '': { w: 250 },
  ' .Field-check': { w: 30 },
  ' .FieldLabel': { w: 55 },
  ' input': {
    textAlign: 'center',
    border: 0,
    bg: 'transparent',
    fg: 'inherit',
  },
  '-selected .PanelHeader': {
    row: 1,
    bg: 'primary',
  },
});

export const Group = ({ group }: { group: MGroup }) => {
  const router = useRouter();
  const selected = useFluxMemo(() => api2.groups.id$.map((id) => group.id === id));

  return (
    <Panel
      {...c('', selected && '-selected')}
      header={
        <>
          <Field
            type="check"
            value={selected}
            onValue={(v) => v && router.go({ group: group.key })}
          />
          <Field
            value={group.name}
            onValue={async (name) => api2.groups.update(group.id, { name })}
          />
        </>
      }
    >
      <Field label="ID" value={group.id} readonly />
      <Field
        label="Clé"
        value={group.key}
        onValue={async (key) => {
          await api2.groups.update(group.id, { key });
        }}
      />
      <Field
        type="color"
        value={group.config?.primary}
        onValue={async (primary) => {
          await api2.groups.apply(group.id, (p) => {
            p.config = { ...p.config, primary }
          });
        }}
      />
      <Field
        type="color"
        value={group.config?.secondary}
        onValue={async (secondary) => {
          await api2.groups.apply(group.id, (p) => {
            p.config = { ...p.config, secondary }
          });
        }}
      />
    </Panel>
  );
};
