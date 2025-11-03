import { Field } from '@common/components';
import { useFlux } from '@common/hooks';
import { Search } from 'lucide-react';
import { Css } from 'fluxio';
import { Button } from '@common/components';
import { search$ } from '../controllers/search';
import { Flux } from 'fluxio';

const c = Css('SearchField', {
  '': {
    fRow: 1,
  },
});

const isSearchOpen$ = new Flux(false);

export const SearchField = () => {
  const search = useFlux(search$);
  const isSearchOpen = useFlux(isSearchOpen$);

  return (
    <div {...c()}>
      {isSearchOpen && <Field name="search" value={search} onValue={search$.setter()} />}
      <Button
        icon={<Search />}
        color="primary"
        onClick={() => isSearchOpen$.set((prev) => !prev)}
      />
    </div>
  );
};
