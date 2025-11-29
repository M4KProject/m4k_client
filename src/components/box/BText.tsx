import { Css } from 'fluxio';
import { BComp } from './bTypes';
import { createElement } from 'preact';

const c = Css('BText', {
  '': {
    position: 'relative',
    display: 'inline-block',
    m: '1%',
    p: '1%',
  },
});

export const BText: BComp = ({ item, props }) => {
  console.debug('BText', props);

  const children = [];
  const text = item.b;
  if (text) {
    const parts = text.matchAll(/\*\*(?<b>.+?)\*\*|(?<n>\n)|(?<t>[^*\n]+)/g);
    for (const { groups } of parts) {
      const { b, n, t } = groups!;
      if (b) {
        children.push(<b>{b}</b>);
      } else if (n) {
        children.push(<br />);
      } else if (t) {
        children.push(<span>{t}</span>);
      }
    }
  }

  return createElement('div', { ...props, ...c(props, '') }, ...children);
};
