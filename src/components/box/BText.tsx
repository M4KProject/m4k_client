import { Css } from 'fluxio';
import { BComp } from './bTypes';

const c = Css('BText', {
  '': {

  }
});

export const BText: BComp = ({ item, props }) => {
  console.debug('BText', props);

  const children = [];
  if (item.text) {
    const parts = item.text.matchAll(/\*\*(?<b>.+?)\*\*|(?<n>\n)|(?<t>[^*\n]+)/g);
    let i=0;
    for (const { groups } of parts) {
      const { b, n, t } = groups!;
      if (b) {
        children.push(<b key={i++}>{b}</b>);
      } else if (n) {
        children.push(<br key={i++}/>);
      } else if (t) {
        children.push(<span key={i++}>{t}</span>);
      }
    }
  }

  return <div {...props} {...c('', props)}>{children}</div>;
};
