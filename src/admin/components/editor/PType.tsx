import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { PProps } from './interfaces';
import B from './B';

const labelDico: Record<string, string> = {
  '': 'Élément',
  box: 'Élément',
  row: 'Ligne',
  col: 'Colone',
  video: 'Lecteur Vidéo',
  img: 'Image',
  icons: 'Icons',
  price: 'Price',
  lang: 'Langage',
  title: 'Titre',
  drink: 'Une Boisson',
  dish: 'Un Plat',
  product: 'Un Produit',
  cat: 'Category',
  carousel: 'Caroussel',
  header: 'Entête',
  pdf: 'Lecteur PDF',
  ctn: 'Texte',
  root: 'Racine',
  btn: 'Bouton'
};

function getTypes() {
  const dico: Record<string, true> = {};
  B.root.forEach((b) => (dico[b.d.t || ''] = true));
  Object.keys(B.templates).forEach((t) => (dico[t || ''] = true));

  delete dico.root;
  const types = Object.keys(dico).map((key) => [key, labelDico[key] || key] as [string, string]);
  types.sort((a, b) => a[1].localeCompare(b[1]));

  return types;
}

export default function PType({ v, setV, b }: PProps) {
  const types = getTypes();
  return (
    <div className="PInput">
      <TextField
        size="small"
        select
        value={v || ''}
        onChange={(e) => {
          let type = String(e.target.value);
          if (type === '' || type === 'box') {
            setV(undefined);
            return;
          }
          setV(e.target.value);
          if (!b) return;
          switch (b.d.t) {
            case 'ctn':
              if (!b.d.ctn) b.update({ ctn: 'Mon texte !' });
              if (!b.d.style?.fontSize) b.updateStyle({ fontSize: '3em' });
              break;
            case 'cat':
              if (!b.d.title) b.update({ title: 'Ma Catégorie' });
              break;
            case 'dish':
              if (!b.d.title) b.update({ title: 'Mon Plat' });
              if (!b.d.prices) b.update({ prices: [10] });
              break;
            case 'drink':
              if (!b.d.title) b.update({ title: 'Ma Boisson' });
              if (!b.d.prices) b.update({ prices: [10] });
              break;
            case 'product':
              if (!b.d.title) b.update({ title: 'Mon Article' });
              if (!b.d.prices) b.update({ prices: [10] });
              break;
          }
        }}
      >
        {types.map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
        {labelDico[v || ''] ? null : (
          <MenuItem value={v || ''}>{v || ''}</MenuItem>
        )}
      </TextField>
    </div>
  );
}
