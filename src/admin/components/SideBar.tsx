import { useMsg } from '@common/hooks';
import { useCss } from '@common/hooks';
import { Css, flexColumn } from '@common/ui';
import { Side, SideButton, SideSep } from '@common/components';
import { Div } from '@common/components';
import { Home, Users, Monitor, Image, User, Zap } from 'lucide-react';
import { group$, isAdvanced$, useGroupKey } from '../messages';
import { AdminPage, adminPage$ } from '../messages/adminPage$';
import { syncGroups } from '@common/api/syncGroups';

const css: Css = {
  '&': {
    position: 'relative',
    w: 13,
    transition: 0.2,
  },
  '&Mask': {
    position: 'absolute',
    x: 0,
    y: '50%',
    w: 13,
    h: '100%',
    zIndex: 100,
    overflow: 'hidden',
    translateY: '-50%',
    transition: 0.2,
  },
  '&Content': {
    ...flexColumn({ align: 'stretch' }),
    position: 'absolute',
    color: '#ffffff',
    fg: 'sideFg',
    xy: 0,
    wMinMax: 13,
    h: '100%',
  },

  '&Sep': {
    ...flexColumn({ align: 'start', justify: 'end' }),
    pl: 1,
    flex: 1,
    color: '#0a536f',
    fontWeight: 'bold',
    borderBottom: '1px solid #0a536f',
  },
  '&Sep-version': {
    fontSize: 0.7,
    opacity: 0.5,
    p: 0,
    pl: 0.7,
  },
  '&Sep-group': {
    fontSize: 1,
    p: 0,
    pl: 0.7,
  },

  '&-editor': { w: 0 },
  '&-editor &Mask': {
    w: 3,
    h: 18,
    bg: '#0090c87a',
    elevation: 1,
    borderRadius: '0 0.5em 0.5em 0',
  },
  '&-editor &Sep': { visibility: 'hidden' },
};

export const SideBar = () => {
  const c = useCss('SideBar', css);
  const isAdvanced = useMsg(isAdvanced$);

  const group = useMsg(group$);
  const groupById = useMsg(syncGroups.byId$);
  const groups = Object.values(groupById);
  if (groups.length === 1) group$.set(groups[0]);

  const go = (value: AdminPage) => () => adminPage$.set(value);

  return (
    <Side page$={adminPage$}>
      <SideSep />
      <SideButton title="Groupes" icon={<Home />} page="groups" onClick={go('groups')} />
      <SideSep />
      {group || isAdvanced ? (
        <>
          <Div cls={`${c}Sep ${c}Sep-group`}>{group?.name}</Div>
          <SideButton title="Membres" icon={<Users />} page="members" onClick={go('members')} />
          <SideButton title="Appareils" icon={<Monitor />} page="devices" onClick={go('devices')} />
          <SideButton title="Médias" icon={<Image />} page="medias" onClick={go('medias')} />
          <SideButton title="Jobs" icon={<Zap />} page="jobs" onClick={go('jobs')} />
        </>
      ) : null}
      <SideSep />
      <Div cls={`${c}Sep ${c}Sep-version`}>2.0.0</Div>
      <SideButton title="Mon Compte" icon={<User />} page="account" onClick={go('account')} />
    </Side>
  );
};
