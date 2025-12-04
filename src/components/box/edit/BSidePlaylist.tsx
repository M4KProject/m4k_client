import { Css } from 'fluxio';
import { Button } from '@/components/common/Button';
import { PlusIcon } from 'lucide-react';
import { BMedias } from './BMedias';
import { BSideContent } from './BSideContent';

const c = Css('BSidePlaylist', {
  '': {
    col: ['stretch', 'start'],
  },
});

export const BSidePlaylist = () => {
  return (
    <BSideContent>
      <Button color="primary" icon={PlusIcon} title="Ajouter une playlist" />
      <BMedias />
    </BSideContent>
  );
};
