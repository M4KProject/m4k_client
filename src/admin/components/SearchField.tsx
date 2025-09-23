import { Field } from '@common/components';
import { useMsg } from '@common/hooks';
import { Search } from 'lucide-react';
import { Css } from '@common/ui';
import { Button } from '@common/components';
import { search$ } from '../messages/search$';
import { Msg } from '@common/utils';

const c = Css('SearchField', {
  '': {
    fRow: 1,
  },
});

const isSearchOpen$ = new Msg(false);

export const SearchField = () => {
  const search = useMsg(search$);
  const isSearchOpen = useMsg(isSearchOpen$);

  return (
    <div class={c()}>
      {isSearchOpen && <Field name="search" value={search} onValue={search$.setter()} />}
      <Button icon={<Search />} color="primary" onClick={() => isSearchOpen$.next(prev => !prev)} />
    </div>
  );
};
