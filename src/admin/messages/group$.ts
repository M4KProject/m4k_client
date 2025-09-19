import { GroupModel } from '@common/api/models';
import { useMsg } from '@common/hooks';
import { isItem, isStr, Msg } from '@common/utils';
import { collGroups } from '@common/api/collGroups';

export const groupKey$ = new Msg('', 'groupKey$', true, isStr);
export const group$ = new Msg<GroupModel>(null, 'group$', true, isItem);

groupKey$.debounce(10).on(async (key) => {
  const prev = group$.v;
  if (prev && prev.key === key) return;
  const next = await collGroups.findKey(key);
  if (next && groupKey$.v === next.key) group$.set(next);
});

group$.debounce(10).on((group) => {
  groupKey$.set(group?.key || '');
});

export const useGroupKey = () => useMsg(groupKey$);
export const useGroup = () => useMsg(group$);
