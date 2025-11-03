import { getSelect } from './bEdit';
import { B } from './B';
import { Css } from 'fluxio';
import { useFlux } from '@common/hooks';
import { useEffect, useRef } from 'preact/hooks';
import { BoxIcon } from 'lucide-react';

const c = Css('EdTree', {
  '': {
    flex: 2,
    maxWidth: 400,
    border: '1px solid grey',
    p: 0.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
    overflowY: 'auto',
  },
  Item: {
    m: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    border: '1px solid #FFF',
  },
  ItemHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ItemChildren: {
    pl: 2,
  },
  'Item-out': {
    textDecoration: 'line-through',
  },
  'Item-hide': {
    opacity: 0.5,
  },
  'Item-active': {
    fontWeight: 'bold',
    borderColor: '#000',
    borderRadius: 1,
  },
});

const iconByT: Record<string, typeof BoxIcon> = {
  root: BoxIcon,
  row: BoxIcon,
  col: BoxIcon,
  lang: BoxIcon,
  title: BoxIcon,
  ctn: BoxIcon,
  page: BoxIcon,
  cat: BoxIcon,
  drink: BoxIcon,
  dish: BoxIcon,
  product: BoxIcon,
  img: BoxIcon,
  video: BoxIcon,
  carousel: BoxIcon,
  btn: BoxIcon,
  pdf: BoxIcon,
};

const labelClean = (html: string) => {
  const txt = decodeURIComponent(html.replace(/(<([^>]+)>)/gi, ''));
  const txtShort = txt.length > 13 ? txt.substring(0, 10).trimEnd() + '...' : txt;
  return txtShort;
};

const getLabel = (b: B) => {
  if (!b.parent) return 'Racine';
  const d = b.d;
  if (d.title) return labelClean(d.title);
  if (d.ctn) return labelClean(d.ctn);
  if (d.alt) return labelClean(d.alt);
  if (d.page) return d.page;
  if (d.lang) return d.lang;
  if (d.cls) return labelClean(d.cls);
  if (d.t) return d.t;
  return 'box';
};

const hasChildSelected = (b?: B) => {
  let n: B | undefined = getSelect();
  while (n) {
    if (b === n) return true;
    n = n.parent;
  }
  return false;
};

const EdItem = (props: { b?: B }) => {
  const ref = useRef<HTMLDivElement>(null);
  const b = props.b || B.root;
  const select = useFlux(B.select$);
  useFlux(b.update$);

  const d = b.d;
  const Icon =
    iconByT[
      d.t ||
        (!b.parent ? 'root'
        : d.ctn ? 'ctn'
        : '')
    ] || BoxIcon;
  const label = getLabel(b);

  const isActive = select === b;

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [isActive, ref.current]);

  const showChildren = hasChildSelected(b);
  // console.debug('showChildren', b.d.t, showChildren);

  return (
    <div
      {...c('Item', d.stock === 0 && 'Item-out', d.hide && 'Item-hide', isActive && 'Item-active')}
      ref={ref}
      draggable
      // onDragStart={editorCtrl.getOnDragStart(b)}
      // onDragEnter={editorCtrl.getOnDragEnter(b)}
      // onDragEnd={editorCtrl.getOnDragEnd(b)}
    >
      <div
        className="EdItemHeader"
        // onClick={editorCtrl.getOnClick(b)}
      >
        <Icon />
        <div className="EdItemLabel">{label}</div>
      </div>
      {showChildren && (
        <div className="EdItemChildren">
          {b.children.map((b, i) => (
            <EdItem key={i} b={b} />
          ))}
        </div>
      )}
    </div>
  );
};

export const EdTree = () => {
  console.debug('EdTree');

  return (
    <div {...c()}>
      <EdItem />
    </div>
  );
};
