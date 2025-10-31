import { PProps } from './interfaces';
import TextField from '@mui/material/TextField';
import { toArray, last } from 'vegi';

export default function PStrArr({ v, setV, b }: PProps) {
  const texts: string[] = [...toArray(v)];
  texts.push('');

  const onChange = (e: any, i: number) => {
    texts[i] = e.target.value;
    while (last(texts) === '') texts.pop();
    // console.debug('PTPrices onChange', texts);
    setV(texts);
  };

  // console.debug('PTPrices', texts);

  return (
    <div className="PInput PTPrices">
      {texts.map((text, i) => (
        <TextField
          key={i}
          className="PTPrice"
          size="small"
          inputProps={{ inputMode: 'numeric' }}
          value={text}
          onChange={(e) => onChange(e, i)}
        />
      ))}
    </div>
  );
}
