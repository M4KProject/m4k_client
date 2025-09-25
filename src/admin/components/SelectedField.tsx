import { useMsgItem } from '@common/hooks/useMsg';
import { Field } from '@common/components';
import { selectedById$ } from '../controllers/selected';

export const SelectedField = ({ id }: { id: string }) => {
  const [selected, setSelected] = useMsgItem(selectedById$, id);
  return (
    <Field type="check" value={selected} onValue={(check) => setSelected(check || undefined)} />
  );
};
