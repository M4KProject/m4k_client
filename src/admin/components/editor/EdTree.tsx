import Box from '@mui/material/Box';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import BoxIcon from '@mui/icons-material/Article';
import RootIcon from '@mui/icons-material/HomeTwoTone';
import RowIcon from '@mui/icons-material/ViewColumnTwoTone';
import ColIcon from '@mui/icons-material/TableRowsTwoTone';
import LangIcon from '@mui/icons-material/FlagTwoTone';
import TitleIcon from '@mui/icons-material/TitleTwoTone';
import CtnIcon from '@mui/icons-material/ShortTextTwoTone';
import PageIcon from '@mui/icons-material/MenuBook';
import CatIcon from '@mui/icons-material/FolderTwoTone';
import DrinkIcon from '@mui/icons-material/WineBarTwoTone';
import DishIcon from '@mui/icons-material/RestaurantTwoTone';
import ProductIcon from '@mui/icons-material/DescriptionTwoTone';
import ImgIcon from '@mui/icons-material/Image';
import VideoIcon from '@mui/icons-material/Slideshow';
import CarouselIcon from '@mui/icons-material/ViewCarousel';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import BtnIcon from '@mui/icons-material/Mouse';
import { useEffect, useRef } from 'react';
import { useMsg } from 'vegi';
import { getSelect } from '../../../helpers/bEdit';
import { editorCtrl } from '../../controllers/EditorController';
import clsx from 'clsx';
import B from '../../../site/B';

const iconByT: Record<string, OverridableComponent<SvgIconTypeMap<{}, 'svg'>>> = {
  root: RootIcon,
  row: RowIcon,
  col: ColIcon,
  lang: LangIcon,
  title: TitleIcon,
  ctn: CtnIcon,
  page: PageIcon,
  cat: CatIcon,
  drink: DrinkIcon,
  dish: DishIcon,
  product: ProductIcon,
  img: ImgIcon,
  video: VideoIcon,
  carousel: CarouselIcon,
  btn: BtnIcon,
  pdf: PdfIcon,
};

function labelClean(html: string) {
  const txt = decodeURIComponent(html.replace(/(<([^>]+)>)/gi, ''));
  const txtShort = txt.length > 13 ? txt.substring(0, 10).trimEnd() + '...' : txt;
  return txt;
}

function getLabel(b: B) {
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
}

function hasChildSelected(b?: B) {
  let n: B | undefined = getSelect();
  while (n) {
    if (b === n) return true;
    n = n.parent;
  }
  return false;
}

function EdItem(props: { b?: B }) {
  const ref = useRef<HTMLDivElement>(null);
  const b = props.b || B.root;
  const select = useMsg(B.select$);
  useMsg(b.update$);

  const d = b.d;
  const Icon = iconByT[d.t || (!b.parent ? 'root' : d.ctn ? 'ctn' : '')] || BoxIcon;
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
      ref={ref}
      className={clsx('EdItem', d.stock === 0 && 'EdItem-out', d.hide && 'EdItem-hide', isActive && 'EdItem-active')}
      draggable
      onDragStart={editorCtrl.getOnDragStart(b)}
      onDragEnter={editorCtrl.getOnDragEnter(b)}
      onDragEnd={editorCtrl.getOnDragEnd(b)}
    >
      <div className="EdItemHeader" onClick={editorCtrl.getOnClick(b)}>
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
}

export default function EdTree() {
  console.debug('EdTree');

  return (
    <Box
      className="EdTree"
      sx={{
        flex: 2,
        maxWidth: 400,
        border: '1px solid grey',
        p: 0.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflow: 'hidden',
        overflowY: 'auto',
        '& .EdItem': {
          m: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          border: '1px solid #FFF',
        },
        '& .EdItemHeader': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        '& .EdItemChildren': {
          pl: 2,
        },
        '& .EdItem-out': {
          textDecoration: 'line-through',
        },
        '& .EdItem-hide': {
          opacity: 0.5,
        },
        '& .EdItem-active': {
          fontWeight: 'bold',
          borderColor: '#000',
          borderRadius: 1,
        },
      }}
    >
      <EdItem />
    </Box>
  );
}
