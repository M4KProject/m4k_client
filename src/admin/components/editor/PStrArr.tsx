import { Field } from '@common/components';
import { PProps } from './interfaces';
import { last, toArray } from 'fluxio';

export const PStrArr = ({ v, setV, b }: PProps) => {
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
        <Field
          type="number"
          key={i}
          className="PTPrice"
          value={text}
          onChange={(e) => onChange(e, i)}
        />
      ))}
    </div>
  );
};
