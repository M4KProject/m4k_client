import { useFluxItem } from '@common/hooks/useFlux';
import { Field } from '@common/components';
import { selectedById$ } from '../controllers/selected';

export const SelectedField = ({ id }: { id: string }) => {
  const [selected, setSelected] = useFluxItem(selectedById$, id);
  return (
    <Field type="check" value={selected} onValue={(check) => setSelected(check || undefined)} />
  );
};
