import { useFluxItem } from '@/hooks/useFlux';
import { selectedById$ } from '../controllers/selected';
import { Field } from '@/components/Field';

export const SelectedField = ({ id }: { id: string }) => {
  const [selected, setSelected] = useFluxItem(selectedById$, id);
  return (
    <Field type="check" value={selected} onValue={(check) => setSelected(check || undefined)} />
  );
};
