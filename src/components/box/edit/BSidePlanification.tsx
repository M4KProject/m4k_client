import { Css } from 'fluxio';
import { Button } from '@/components/common/Button';
import { PlusIcon } from 'lucide-react';

const c = Css('BSidePlanification', {
  '': {
    col: ['stretch', 'start'],
  }
});

export const BSidePlanification = () => {
  return (
    <div {...c('')}>
      <Button color="primary" icon={PlusIcon} title="Ajouter" />
    </div>
  );
};