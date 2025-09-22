import { Field } from '@common/components';
import { useMsg } from '@common/hooks';

import { Search } from 'lucide-react';
import { Css } from '@common/ui';

import { Button } from '@common/components';
import { search$ } from '../messages/search$';

const c = Css('SearchField', {
  '': {
    fRow: 1,
  },
});

export const SearchField = () => {
  const search = useMsg(search$);

  return (
    <div class={c()}>
      <Field name="search" value={search} onValue={search$.setter()} />
      <Button icon={<Search />} color="primary" onClick={() => search$.signal()} />
    </div>
  );
};
