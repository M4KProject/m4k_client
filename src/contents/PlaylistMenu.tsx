import { useCss, useMsg } from '@common/hooks';
import { Css, Msg, formatMs, toStr, toNbr, flexRow } from '@common/helpers';
import { Button, Field, FieldProps } from '@common/components';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { useState } from 'preact/hooks';
import { ComponentChildren } from 'preact';

const css: Css = {
  '&': {
    ...flexRow({ align: 'center' }),
    p: 2,
    pointerEvents: 'auto',
  },
};

interface PlaylistMenuProps extends FieldProps<any> {}

export const PlaylistMenu = (props: PlaylistMenuProps) => {
  const c = useCss('PlaylistMenu', css);
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={c}>
      <Button icon={isOpen ? <MdMenuOpen /> : <MdMenu />} onClick={() => setIsOpen(o => !o)} />
      {isOpen && (
        <Field type="select" {...props} />
      )}
    </div>
  );
};