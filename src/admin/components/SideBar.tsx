import { useMsg } from '@common/hooks';
import {
  openGroups,
  openMembers,
  openDevices,
  openContents,
  openAccount,
  adminPage$,
  openMedias,
  group$,
} from '../controllers/Router';
import { useCss } from '@common/hooks';
import { Css, Msg } from '@common/helpers';
import { flexColumn } from '@common/helpers';
import { Side, SideButton, SideSep } from '@common/components';
import { Div } from '@common/components';
import {
  MdHouse,
  MdPeople,
  MdDevices,
  MdSystemUpdate,
  MdPermMedia,
  MdAccountCircle,
} from 'react-icons/md';
import { isAdvanced$ } from '../messages';

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
  const group = useMsg(group$);
  const isAdvanced = useMsg(isAdvanced$);

  return (
    <Side page$={adminPage$ as Msg<string>}>
      <SideSep />
      <SideButton title="Groupes" icon={<MdHouse />} page="groups" onClick={() => openGroups()} />
      <SideSep />
      {group || isAdvanced ? (
        <>
          <Div cls={`${c}Sep ${c}Sep-group`}>{group?.name}</Div>
          <SideButton title="Membres" icon={<MdPeople />} page="members" onClick={openMembers} />
          <SideButton title="Appareils" icon={<MdDevices />} page="devices" onClick={openDevices} />
          <SideButton
            title="Contenus"
            icon={<MdSystemUpdate />}
            page="contents"
            onClick={openContents}
          />
          <SideButton title="Médias" icon={<MdPermMedia />} page="medias" onClick={openMedias} />
        </>
      ) : null}
      <SideSep />
      <Div cls={`${c}Sep ${c}Sep-version`}>2.0.0</Div>
      <SideButton
        title="Mon Compte"
        icon={<MdAccountCircle />}
        page="account"
        onClick={openAccount}
      />
    </Side>
  );
};
