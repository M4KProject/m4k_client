import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { getSelect, rmProp, rmStyleProp, setSelect } from './bEdit';
import { useFlux } from 'vegi';
import { D, DRoot, DStyle } from './D';
import type { PProps } from './interfaces';
import PHtml from './PHtml';
import MenuItem from '@mui/material/MenuItem';
import RemoveIcon from '@mui/icons-material/RemoveCircleTwoTone';
import PColor from './PColor';
import PFile, { PFiles } from './PFile';
import PType from './PType';
import { cloneJson, toNumber, deleteKey } from 'vegi';
import PPrices from './PPrices';
import PStrArr from './PStrArr';
import B from './B';

function PStr({ v, setV }: PProps) {
  return <TextField className="PInput" size="small" value={v || ''} onChange={(e) => setV(e.target.value)} />;
}

function PCls(props: PProps) {
  return <PStr {...props} />;
}

function PKey({ v, setV }: PProps) {
  return (
    <TextField
      className="PInput"
      size="small"
      inputProps={{ inputMode: 'text', pattern: '[a-zA-Z0-9\\-_]*' }}
      value={v}
      onChange={(e) => setV(e.target.value)}
    />
  );
}

function PBool({ v, setV }: PProps) {
  return <Switch size="small" checked={!!v} onChange={(e) => setV(e.target.checked)} />;
}

function PNbr({ v, setV, text, setText }: PProps) {
  return (
    <TextField
      className="PInput"
      size="small"
      inputProps={{ inputMode: 'numeric' }}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        setV(toNumber(e.target.value, 0));
      }}
    />
  );
}

// function PPrices({ v, setV, b }: PProps) {
//     return (
//         <>
//             <TextField className="PInput" size="small" inputProps={{ inputMode: 'numeric' }} value={v||''} onChange={e => setV(e.target.value)} />
//             <TextField className="PInput" size="small" inputProps={{ inputMode: 'numeric' }} value={v||''} onChange={e => setV(e.target.value)} />
//             <TextField className="PInput" size="small" inputProps={{ inputMode: 'numeric' }} value={v||''} onChange={e => setV(e.target.value)} />
//         </>
//     );
// }

// function PStyle(props: PProps) {
//     return (
//         <>
//             <PStr {...props} />
//             <PStr {...props} />
//             <PStr {...props} />
//         </>
//     );
// }

function PAuto(props: PProps) {
  return <PStr {...props} />;
}

function PUnit({ v, setV }: PProps) {
  const [_, n, u] = String(v).match(/([0-9\.]+)(.+)/) || [];
  const setN = (n: string) => setV(n + (u || '%'));
  const setU = (u: string) => setV(n + (u || '%'));
  return (
    <>
      <TextField
        className="PInput"
        size="small"
        inputProps={{ inputMode: 'numeric' }}
        value={n || ''}
        onChange={(e) => setN(e.target.value)}
      />
      <TextField className="PInput" size="small" value={u || '%'} onChange={(e) => setU(e.target.value)} select>
        <MenuItem value="rem">rem</MenuItem>
        <MenuItem value="em">em</MenuItem>
        <MenuItem value="px">px</MenuItem>
        <MenuItem value="%">%</MenuItem>
      </TextField>
    </>
  );
}

type POptions = {
  order?: number;
  if?: string[];
  notIf?: string[];
  showIf?: string[];
  showFun?: (b: B) => boolean;
  notShowIf?: string[];
  vs?: string[];
};

type PInfo = [(props: PProps) => JSX.Element | null, string, POptions];

const pDico: Record<keyof DRoot, PInfo | null> = {
  home: [PKey, 'Page d’accueil', { if: ['root'] }],
  src: null,
  video: [PFile, 'Vidéo', { showIf: ['video'] }],
  cssFs: [PFiles, 'Fichiers CSS', { if: ['root'] }],
  jsFs: [PFiles, 'Fichiers JS', { if: ['root'] }],
  id: [PKey, 'Id élément', { notIf: ['root'] }],
  hide: [PBool, 'Cacher', { notIf: ['root'] }],
  stock: [PNbr, 'Quantité', { order: 75, if: ['dish', 'drink', 'product'], showIf: ['dish', 'drink', 'product'] }],
  t: [PType, 'Type', { order: 100, notIf: ['root'], notShowIf: ['root'] }],
  ctn: [PHtml, 'Contenu', { order: 10, showIf: ['ctn'] }],
  cls: [PCls, 'Classe', {}],
  page: [PKey, 'Page clé', { if: ['page'] }],
  pdf: [PFile, 'Pdf', { order: 90, if: ['pdf'], showIf: ['pdf'] }],
  bgImg: [PFile, 'Image', { order: 90, showIf: ['img'] }],
  img: [PFile, 'Image', { order: 90, showIf: ['btn', 'cat', 'dish', 'drink', 'product'] }],
  doc: [PFile, 'Document', { order: 90, showIf: ['product'] }],
  delay: [PNbr, 'Retard (sec)', { if: ['carousel', 'pdf'], showIf: ['carousel', 'pdf'] }],
  duration: [PNbr, 'Durée (sec)', { if: ['carousel', 'pdf'], showIf: ['carousel', 'pdf'] }],
  lang: [PKey, 'Langue ISO', { if: ['lang'] }],
  alt: [PStr, 'Nom du fichier', { if: ['img', 'video'] }],
  title: [PHtml, 'Titre', { order: 89, if: ['cat', 'dish', 'drink', 'product'], showIf: ['cat', 'dish', 'drink', 'product'] }],
  desc: [PHtml, 'Description', { order: 88, if: ['cat', 'dish', 'drink', 'product'], showIf: ['cat', 'dish', 'drink', 'product'] }],
  info: [PHtml, 'Information', { order: 87, if: ['cat', 'dish', 'drink', 'product'], showIf: ['cat', 'dish', 'drink', 'product'] }],
  // info2: [PHtml, 'Information', {order: 86}],
  cl: [PNbr, 'Volume cl', { order: 79, if: ['drink'], showIf: ['drink'] }],
  prices: [PPrices, 'Prix', { order: 78, if: ['dish', 'drink', 'product'], showIf: ['dish', 'drink', 'product'] }],
  tPrices: [PStrArr, 'Type Prix', { order: 78, if: ['cat'], showIf: ['cat'] }],
  icons: [PStrArr, 'Icons', { order: 29, if: ['dish', 'drink', 'product'], showIf: ['dish', 'drink', 'product'] }],
  tags: [PStrArr, 'Mots clés', { order: 28, if: ['dish', 'drink', 'product'], showIf: ['dish', 'drink', 'product'] }],
  allergens: [PStrArr, 'Allergènes', { order: 27, if: ['cat', 'dish', 'drink'] }],
  // src: [PFile, 'Fichier', {if: ['img']}],
  editor: null,
  version: null,
  tr: null,
  style: null,
  hTag: null,
  attrs: null,
  children: null,
  l: null,
  prop: null,
  propLink: null,
  click: [PStr, 'Click', { order: 0, if: ['btn'], showIf: ['btn'] }],
  render: null,
  boxCls: null,
  boxTag: null,
  templates: null,
  xs: null,
  sm: null,
  md: null,
  lg: null,
  xl: null,
  fonts: null,
  filter: null,
  hasCart: null,
};

const sDico: Partial<Record<keyof DStyle, PInfo | null>> = {
  color: [PColor, 'Couleur texte', { order: 10 }],
  borderColor: [PColor, 'Couleur bord', { order: 10 }],
  backgroundColor: [PColor, 'Couleur fond', { order: 10 }],
  borderWidth: [PUnit, 'Taille bord', { order: 10 }],
  fontFamily: [PStr, 'Police', { order: 10 }],
  fontSize: [PUnit, 'Taille police', { order: 10, showIf: ['ctn'] }],
  lineHeight: [PAuto, 'Hauteur ligne', { order: 10, vs: ['normal'] }],
  // left: [PUnit, 'X', {}],
  // top: [PUnit, 'Y', {}],
  // width: [PUnit, 'Width', {}],
  // height: [PUnit, 'Height', {}],
  backgroundPosition: [PAuto, 'Position fond', { vs: ['center', 'right', 'left', 'top', 'bottom'] }],
  backgroundRepeat: [PAuto, 'Répétition fond', { vs: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'] }],
  backgroundSize: [PAuto, 'Taille fond', { vs: ['auto', 'contain', 'cover'] }],
  display: [PAuto, 'Affichage', { vs: ['inline', 'block', 'flex', 'inline-flex', 'none'] }],
  overflow: [PAuto, 'Débordement', { vs: ['hidden', 'auto'] }],
  textOverflow: [PAuto, 'Texte débordement ', { vs: ['clip', 'ellipsis'] }],
  visibility: [PAuto, 'Visibilité', { vs: ['visible', 'hidden'] }],
  whiteSpace: [PAuto, 'Espace blanc', { vs: ['nowrap', 'normal'] }],
  position: [PAuto, 'Position', { vs: ['absolute', 'fixed', 'relative'] }],
  flexDirection: [PAuto, 'Flex Direction', { vs: ['row', 'row-reverse', 'column', 'column-reverse'] }],
  flexWrap: [PAuto, 'Flex Wrap', { vs: ['nowrap', 'wrap', 'wrap-reverse'] }],
  justifyContent: [
    PAuto,
    'Justifier',
    { vs: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'baseline', 'stretch'] },
  ],
  alignItems: [
    PAuto,
    'Aligner',
    { vs: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'baseline', 'stretch'] },
  ],
  alignContent: [
    PAuto,
    'Aligner contenu',
    { vs: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'baseline', 'stretch'] },
  ],
  alignSelf: [PAuto, 'Aligner', { vs: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'] }],
  fontStyle: [PAuto, 'Style police', { vs: ['normal', 'italic', 'oblique'] }],
  fontWeight: [PAuto, 'Poids police', { vs: ['light', 'regular', 'medium', 'bold'] }],
  textAlign: [PAuto, 'Aligner texte', { vs: ['left', 'center', 'right', 'justify'] }],
  textTransform: [PAuto, 'Texte transformation ', { vs: ['capitalize', 'lowercase', 'uppercase'] }],
};

interface PropInfo {
  key: string;
  path: string;
  Input: PInfo[0];
  label: PInfo[1];
  options: PInfo[2];
  isStyle: boolean;
}

function pDicoToList(props: PropInfo[], pDico: Record<any, PInfo | undefined | null>, isStyle = false) {
  Object.entries(pDico).forEach(([key, v]) => {
    if (!v) return;
    key = String(key);
    props.push({
      key,
      path: isStyle ? 's.' + key : key,
      Input: v[0],
      label: v[1],
      options: v[2],
      isStyle,
    });
  });
}

const props: PropInfo[] = [
  {
    key: '_position',
    path: '_position',
    label: 'Position',
    Input: PUnit,
    options: {
      showFun: (b: B) => true,
    },
    isStyle: false,
  },
];
pDicoToList(props, pDico);
pDicoToList(props, sDico, true);
props.sort((a, b) => {
  const aOrder = a.options.order || 0;
  const bOrder = b.options.order || 0;
  if (aOrder !== bOrder) return bOrder - aOrder;
  return a.label.localeCompare(b.label);
});

function PAdd({ b }: { b: B }) {
  const addProp = (path: string) => {
    console.debug('addProp', path);
    if (path.startsWith('s.')) {
      b.updateStyle({ [path.substring(2)]: '' });
    } else {
      b.update({ [path]: null });
    }
    setSelect(null);
    setSelect(b);
  };

  const filteredProps = props.filter((info) => {
    const o = info.options;
    if (o) {
      if (o.if && !o.if.includes(b.d.t || 'box')) return false;
      if (o.notIf && o.notIf.includes(b.d.t || 'box')) return false;
    }
    return true;
  });

  return (
    <div className="Prop Prop-add">
      <div className="PLabel">
        <b>Autre propriété :</b>
      </div>
      <TextField
        className="PInput"
        SelectProps={{
          MenuProps: {
            sx: {
              '& li': {
                display: 'flex',
                justifyContent: 'space-between',
              },
            },
          },
        }}
        size="small"
        value={''}
        onChange={(e) => addProp(e.target.value)}
        select
      >
        {filteredProps.map(({ path, label }) => (
          <MenuItem key={path} value={path}>
            <b>{label}</b>
            <i>{path}</i>
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

function PFactory({ pName, sName, b }: { pName?: keyof D; sName?: keyof DStyle; b: B }) {
  useFlux(b.update$);

  const [_v, _setV] = useState<any>(undefined);
  const [_text, setText] = useState<string>('');
  useEffect(() => {
    _setV(undefined);
    setText('');
  }, [b, pName, sName]);

  const d = b.d || ({} as D);
  const style = d.style || ({} as DStyle);

  let v: any = null;
  if (_v !== undefined) {
    v = _v;
  } else if (pName) {
    const tr = d.tr ? d.tr[B.lSource] : {};
    const trValue = tr ? tr[pName] : undefined;
    v = trValue !== undefined ? trValue : d[pName];
  } else if (sName) {
    v = style[sName];
  }

  const text = _text === '' ? (v ? String(v) : '') : _text;
  const p = pName ? pDico[pName] : sName ? sDico[sName] : null;
  if (!p) return null;

  const P = p[0];

  const setV = (val: any) => {
    _setV(val);
    if (pName) {
      const changes: Partial<D> = { [pName]: val };
      const tr = b.d.tr || {};
      let nextTr: Record<string, D> | undefined = undefined;
      Object.keys(tr).forEach((lang) => {
        if (tr[lang][pName]) {
          if (!nextTr) nextTr = cloneJson(tr) || {};
          delete nextTr[lang][pName];
        }
      });
      if (nextTr) changes.tr = nextTr;
      b.update(changes);
      if (b.d.tr && !Object.values(b.d.tr).find((trLang) => Object.values(trLang).length)) {
        b.setData(deleteKey({ ...b.d }, 'tr'));
      }
    } else if (sName) {
      b.updateStyle({ [sName]: val });
    }
  };

  return (
    <div className={'Prop Prop-' + String(pName || sName)}>
      <div className="PLabel">
        <div
          className="PRemove"
          onClick={() => {
            if (pName) {
              rmProp(b, pName);
            }
            if (sName) {
              rmStyleProp(b, sName);
            }
            setSelect(null);
            setSelect(b);
          }}
        >
          <RemoveIcon />
        </div>
        <b>
          {p[1]} :<i>{pName}</i>
        </b>
      </div>
      <P b={b} v={v} setV={setV} p={pName} text={text} setText={setText} />
    </div>
  );
}

function PList() {
  const b = useFlux(B.select$) || B.root;
  useFlux(b.update$);

  if (!b) return null;

  const d: any = b.d;
  const s: any = b.d.style || {};

  const filteredProps = props.filter(({ isStyle, key, options }) => {
    if (isStyle ? s[key] !== undefined : d[key] !== undefined) return true;
    const o = options;
    if (!o) return false;
    if (o.notShowIf && !o.notShowIf.includes(d.t || 'box')) return true;
    if (o.showIf?.includes(d.t || 'box')) return true;
    if (o.showFun && o.showFun(b)) return true;
    return false;
  });

  return (
    <>
      {filteredProps.map(({ isStyle, path, key }) =>
        isStyle ? (
          <PFactory key={path + b._id} sName={key as keyof DStyle} b={b} />
        ) : (
          <PFactory key={path + b._id} pName={key as keyof D} b={b} />
        ),
      )}
      <PAdd b={b} />
    </>
  );
}

export default function EdProps() {
  return (
    <Box
      className="EdProps"
      sx={{
        p: 1,
        flex: 4,
        border: '1px solid grey',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflowY: 'auto',
        '& .Prop': {
          display: 'flex',
          alignItems: 'center',
        },
        '& .Prop-add': {
          marginBottom: '40px',
        },
        '& .PLabel': {
          width: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // mr: 1,
          '& b': {
            position: 'relative',
          },
          '& i': {
            opacity: 0.5,
            fontSize: '0.6em',
            overflow: 'visible',
            position: 'absolute',
            left: 0,
            bottom: '-8px',
            width: '100%',
            textAlign: 'center',
          },
        },
        '& .PRemove': {
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          color: '#8d0000',
          marginLeft: '-5px',
        },
        '& .PInput': {
          flex: 1,
          m: 0.5,
          display: 'flex',
          flexDirection: 'column',
        },
        '& .PInput-row': {
          flexDirection: 'row',
        },
        '& .PTPrices, & .PPrices': {
          flexDirection: 'row',
        },
        '& .PTPrices input, & .PPrices input': {
          paddingLeft: '2px',
          paddingRight: '2px',
          textAlign: 'center',
        },
      }}
    >
      <PList />
    </Box>
  );
}
