import { groupId$ } from '@common/api';
import { GroupModel } from '@common/api';
import { useMsg } from '@common/hooks';
import { isItem, isStr, Msg } from '@common/utils';
import { groupCtrl } from '../controllers';

export const groupKey$ = new Msg('', 'groupKey$', true, isStr);
export const group$ = new Msg<GroupModel>(null, 'group$', true, isItem);

groupKey$.debounce(10).on(async (key) => {
  const prev = group$.v;
  if (prev && prev.key === key) return;
  const next = await groupCtrl.findKey(key);
  if (next && groupKey$.v === next.key) group$.set(next);
});

group$.debounce(10).on((group) => {
  groupKey$.set(group?.key || '');
  groupId$.set(group?.id || '');
});

export const useGroupKey = () => useMsg(groupKey$);
export const useGroup = () => useMsg(group$);
