import { Field } from '@common/components';
import { useMsg } from '@common/hooks';
import { Div } from '@common/components';
import { Search } from 'lucide-react';
import { flexRow } from '@common/helpers';
import { Css } from '@common/helpers';
import { useCss } from '@common/hooks';
import { Button } from '@common/components';
import { search$ } from '../messages/search$';

const css: Css = {
  '&': {
    ...flexRow({ align: 'center' }),
  },
};

export const SearchField = () => {
  const c = useCss('SearchField', css);
  const search = useMsg(search$);

  return (
    <Div cls={c}>
      <Field name="search" value={search} onValue={search$.setter()} />
      <Button icon={<Search />} color="primary" onClick={() => search$.signal()} />
    </Div>
  );
};
