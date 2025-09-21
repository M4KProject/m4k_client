import { Field } from '@common/components';
import { useMsg } from '@common/hooks';
import { Div } from '@common/components';
import { Search } from 'lucide-react';
import { flexRow, Css } from '@common/ui';

import { Button } from '@common/components';
import { search$ } from '../messages/search$';

const css = Css('SearchField', {
  '&': {
    ...flexRow({ align: 'center' }),
  },
});

export const SearchField = () => {
  const search = useMsg(search$);

  return (
    <Div  cls={css()}>
      <Field name="search" value={search} onValue={search$.setter()} />
      <Button icon={<Search />} color="primary" onClick={() => search$.signal()} />
    </Div>
  );
};
