import { Css, logger } from 'fluxio';
import { PlusIcon } from 'lucide-react';
import { BField } from './BField';
import { Button, ButtonProps } from '@/components/common/Button';
import { Field } from '@/components/fields/Field';
import { BSideContent } from './BSideContent';
import { BSideHierarchy } from './BSideHierarchy';

const log = logger('BSideHierarchy');

const c = Css('BSideHierarchy', {
  '': {
    col: ['stretch', 'start'],
  },
  DayButton: {
    flex: 1,
    h: 35,
    center: 1,
  },
  'DayButton .ButtonContent': {
    rotate: '-45deg',
    fontSize: '80%',
  },
});

const DayButton = ({ day, ...props }: ButtonProps & { day: number }) => (
  <Button {...props} {...c('DayButton')} />
);

export const BSidePage = () => {
  log.d('BSidePage');

  return (
    <BSideContent>
      <BSideHierarchy i={0} />
      <Button color="primary" icon={PlusIcon} title="Ajouter une zone" />
      <Button color="primary" icon={PlusIcon} title="Ajouter" />
      <BField label="D. Début" tooltip="Date Début" prop="n" />
      <BField label="D. Fin" tooltip="Date Fin" prop="n" />
      <BField label="H. Début" tooltip="Heure Début" prop="n" />
      <BField label="H. Fin" tooltip="Heure Fin" prop="n" />
      <Field label="Jour semaine" col>
        <DayButton day={1} title="Lun." />
        <DayButton day={2} title="Mar." />
        <DayButton day={3} title="Mer." />
        <DayButton day={4} title="Jeu." />
        <DayButton day={5} title="Ven." />
        <DayButton day={6} title="Sam." />
        <DayButton day={7} title="Dim." />
      </Field>
    </BSideContent>
  );
};
