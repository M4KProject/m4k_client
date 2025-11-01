import { useState } from 'preact/hooks';
import { PProps } from './interfaces';
import { Field } from '@common/components';
import { last, toArray, toNumber } from 'fluxio';

export const PPrices = ({ v, setV, b }: PProps) => {
  const [_texts, setTexts] = useState(['']);
  const prices: (number | null)[] = toArray(v, []).map((p) => toNumber(p, 0));
  const texts = prices.map((p, i) => String(_texts[i] || p || ''));
  texts.push('');

  const onChange = (e: any, i: number) => {
    texts[i] = e.target.value;
    while (last(texts) === '') texts.pop();
    const newPrices = texts.map((t) => toNumber(t, 0));
    // console.debug('PPrices onChange', prices, texts, newPrices);
    setTexts(texts);
    setV(newPrices);
  };

  // console.debug('PPrices', prices, texts, _texts);

  return (
    <div className="PInput PPrices">
      {texts.map((text, i) => (
        <Field
          type="number"
          key={i}
          className="PPrice"
          value={text}
          onChange={(e) => onChange(e, i)}
        />
      ))}
    </div>
  );
};
