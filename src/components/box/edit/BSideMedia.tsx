import { Css } from 'fluxio';
import { Button } from '@/components/common/Button';
import { PlusIcon } from 'lucide-react';
import { BMedias } from './BMedias';

const c = Css('BSideMedia', {
  '': {
    col: ['stretch', 'start'],
  }
});

export const BSideMedia = () => {
  return (
    <div {...c('')}>
      <Button color="primary" icon={PlusIcon} title="Ajouter" />
      <BMedias />
    </div>
  );
};