import { useMsgItem } from '@common/hooks/useMsg';
import { selectedById$ } from '../messages';
import { Field } from '@common/components';

export const SelectedField = ({ id }: { id: string }) => {
  const [selected, setSelected] = useMsgItem(selectedById$, id);
  return <Field type="check" value={selected} onValue={check => setSelected(check || undefined)} />;
};
