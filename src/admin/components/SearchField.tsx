import { Search } from 'lucide-react';
import { Css } from 'fluxio';
import { search$ } from '@/admin/controllers/search';
import { Flux } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';

const c = Css('SearchField', {
  '': {
    row: 1,
  },
});

const isSearchOpen$ = new Flux(false);

export const SearchField = () => {
  const search = useFlux(search$);
  const isSearchOpen = useFlux(isSearchOpen$);

  return (
    <div {...c()}>
      {isSearchOpen && <Field name="search" value={search} onValue={search$.setter()} />}
      <Button icon={Search} color="primary" onClick={() => isSearchOpen$.set((prev) => !prev)} />
    </div>
  );
};
