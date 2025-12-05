import { useApi } from '@/hooks/useApi';
import { Field } from '@/components/fields/Field';
import { Css } from 'fluxio';
import { useRouter } from '@/hooks/useRoute';
import { GroupModel } from '@/api/models';
import { useFlux } from '@/hooks/useFlux';
import { Panel } from './base/Panel';
import { CheckCheckIcon, CheckIcon, SquareCheckIcon, SquareIcon, UsersIcon } from 'lucide-react';
import { Button } from '../common/Button';

const c = Css('Group', {
  '': {
    m: 8,
    elevation: 1,
    rounded: 3,
    overflow: 'hidden',
    wMin: 200,
    flex: 1,
  },
  Header: {
    row: 1,
    bg: 'header',
    fg: 'headerFg',
  },
  Content: {
    m: 16,
    col: ['center', 'center'],
  },

  ' .Field-check': {
    w: 30,
  },
  ' input': {
    textAlign: 'center',
    border: 0,
    bg: 'transparent',
    fg: 'inherit',
  },
  ' .FieldLabel': {
    w: 55,
  },

  '-selected': {
    elevation: 0,
    bg: 'body',
  },
  '-selected &Header': {
    row: 1,
    bg: 'primary'
  },
});

export const Group = ({ group }: { group: GroupModel }) => {
  const api = useApi();
  const router = useRouter();
  const selected = useFlux(router.groupId$.map(id => group.id === id));

  return (
    <Panel
        {...c('', selected && '-selected')}
        header={(
            <>
                <Field
                    type="check"
                    value={selected}
                    onValue={(v) => v && router.go({ group: group.key || group.id})}
                />
                <Field
                    value={group.name}
                    onValue={(name) => {
                        api.group.update(group.id, { name });
                    }}
                />
            </>
        )}
    >
        <Field
            label="ID"
            value={group.id}
            readonly
        />
        <Field
            label="Clé"
            value={group.key}
            onValue={(key) => {
            api.group.update(group.id, { key });
            }}
        />
        <Field
            type="color"
            value={group.data?.primary}
            onValue={(primary) => {
            api.group.apply(group.id, (prev) => {
                prev.data = { ...prev.data, primary };
            });
            }}
        />
        <Field
            type="color"
            value={group.data?.secondary}
            onValue={(secondary) => {
            api.group.apply(group.id, (prev) => {
                prev.data = { ...prev.data, secondary };
            });
            }}
        />
    </Panel>
  )
}
