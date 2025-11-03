import {
  getSelect,
  setSelect,
  undo,
  redo,
  cut,
  copy,
  paste,
  pasteIn,
  add,
  addIn,
  remove,
  rmProp,
} from './bEdit';
import { D, DStyle } from './D';
import { B } from './B';
import { terminal$ } from './flux';
import { moveItem } from 'fluxio';
import { useFlux } from '@common/hooks';
import { Button, ButtonProps, tooltip } from '@common/components';
import { Css } from 'fluxio';
import {
  FilePlus,
  ClipboardCopy,
  ClipboardX,
  ClipboardPaste,
  CopyPlus,
  Trash,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  Braces,
  Code,
  Italic,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
} from 'lucide-react';

const AddChildIcon = (props: any) => {
  return <FilePlus {...props} style={{ transform: 'rotate(90deg)' }} />;
};

const HorizontalStretchIcon = () => {
  return (
    <svg>
      <path d="M2 2v20h2V2Zm18 0v20h2V2ZM6 7v3h12V7Zm0 7v3h12v-3z"></path>
    </svg>
  );
};

const VerticalStretchIcon = () => {
  return (
    <svg>
      <path d="M2 2v2h20V2Zm5 4v12h3V6Zm7 0v12h3V6ZM2 20v2h20v-2z"></path>
    </svg>
  );
};

const update = (changes?: Partial<D> | null) => {
  if (!changes) return;
  getSelect().update(changes);
};

const updateStyle = (changes?: Partial<DStyle> | null) => {
  if (!changes) return;
  getSelect().updateStyle(changes);
};

const flexRow = () => {
  const s = getComputedStyle(getSelect().el);
  if (s.display !== 'flex' || !s.flexDirection) {
    getSelect().updateStyle({ display: 'flex', flexDirection: 'column' });
    return false;
  }
  return s.flexDirection === 'row';
};

// function setPanel(name: string) {
//   panel$.set(name);
// }

const move = (addIndex: number) => {
  const b = getSelect();
  if (!b.parent) return;
  const children = [...(b.parent.d.children || [])];
  if (moveItem(children, b.d, addIndex)) {
    b.parent.update({ children });
    const index = (b.parent.d.children || []).indexOf(b.d);
    setSelect(b.parent.children[index]);
  }
};

const left = () => {
  console.debug('left');
  const b = getSelect();

  const parent = b.parent;
  if (!parent) return;

  const parent2 = parent.parent;
  if (!parent2) return;

  const parentChildren = [...(parent.d.children || [])];
  const index = parentChildren.indexOf(b.d);
  if (index === -1) return;
  parentChildren.splice(index, 1);
  parent.update({ children: parentChildren });

  const parent2Children = [...(parent2.d.children || [])];
  const parentIndex = parent2Children.indexOf(parent.d);
  parent2Children.splice(parentIndex + 1, 0, b.d);
  parent2.update({ children: parent2Children });

  setSelect(parent2.children[parentIndex + 1]);
};

const right = () => {
  console.debug('right');
  const b = getSelect();
  if (!b.parent || b.parent.children.length < 2) return;

  const parentChildren = [...(b.parent.d.children || [])];
  const i = parentChildren.indexOf(b.d);
  if (i === -1) return;
  parentChildren.splice(i, 1); // remove
  b.parent.update({ children: parentChildren });

  const sibling = b.parent.children[i === 0 ? 0 : i - 1];
  if (!sibling) return;

  const siblingChildren = [...(sibling.d.children || [])];
  siblingChildren.push(b.d);
  sibling.update({ children: siblingChildren });
  setSelect(sibling.children[sibling.children.length - 1]);
};

const setTerminal = (val: string) => terminal$.set(terminal$.get() === val ? '' : val);

const actionMap: Record<string, () => any> = {
  undo: () => undo(),
  redo: () => redo(),

  cut: () => setSelect(cut(getSelect())),
  copy: () => setSelect(copy(getSelect())),
  paste: async () => setSelect(await paste(getSelect())),
  pasteIn: async () => setSelect(await pasteIn(getSelect())),

  add: () => setSelect(add(getSelect())),
  addIn: () => setSelect(addIn(getSelect())),
  remove: () => setSelect(remove(getSelect())),
  hide: () => {
    if (getSelect().d.hide) {
      rmProp(getSelect(), 'hide');
      return;
    }
    update({ hide: true });
  },
  show: () => rmProp(getSelect(), 'hide'),

  up: () => move(-1),
  down: () => move(+1),
  left: () => left(),
  right: () => right(),

  hLeft: () =>
    updateStyle(flexRow() ? { justifyContent: 'flex-start' } : { alignItems: 'flex-start' }),
  hCenter: () => updateStyle(flexRow() ? { justifyContent: 'center' } : { alignItems: 'center' }),
  hRight: () =>
    updateStyle(flexRow() ? { justifyContent: 'flex-end' } : { alignItems: 'flex-end' }),
  hStretch: () =>
    updateStyle(flexRow() ? { justifyContent: 'stretch' } : { alignItems: 'stretch' }),

  vTop: () =>
    updateStyle(flexRow() ? { alignItems: 'flex-start' } : { justifyContent: 'flex-start' }),
  vMiddle: () => updateStyle(flexRow() ? { alignItems: 'center' } : { justifyContent: 'center' }),
  vBottom: () =>
    updateStyle(flexRow() ? { alignItems: 'flex-end' } : { justifyContent: 'flex-end' }),
  vStretch: () =>
    updateStyle(flexRow() ? { alignItems: 'stretch' } : { justifyContent: 'stretch' }),

  tLeft: () => updateStyle({ textAlign: 'left' }),
  tCenter: () => updateStyle({ textAlign: 'center' }),
  tRight: () => updateStyle({ textAlign: 'right' }),
  tJustify: () => updateStyle({ textAlign: 'justify' }),

  json: () => setTerminal('json'),
  html: () => setTerminal('html'),
  css: () => setTerminal('css'),
  js: () => setTerminal('js'),
};

const keyMap: Record<string, string> = {
  ctrl_x: 'cut',
  ctrl_c: 'copy',
  ctrl_v: 'paste',
  ctrl_shift_v: 'pasteIn',
  ctrl_add: 'add',
  ctrl_shift_add: 'addIn',
  delete: 'hide',
  ctrl_delete: 'remove',
  ctrl_left: 'left',
  ctrl_right: 'right',
  ctrl_up: 'up',
  ctrl_down: 'down',
  ctrl_z: 'undo',
  ctrl_shift_z: 'redo',
};

document.addEventListener('keydown', (event) => {
  const ctrl = event.ctrlKey ? 'ctrl_' : '';
  const alt = event.altKey ? 'alt_' : '';
  const shift = event.shiftKey ? 'shift_' : '';
  const key = event.key.toLowerCase().replace('+', 'add').replace('arrow', '');
  const seq = `${ctrl}${alt}${shift}${key}`;
  const actionName = keyMap[seq];
  console.debug('keydown', seq, actionName);

  const active = document.activeElement as HTMLElement;
  if (active && active !== document.body) {
    if (seq === 'escape') {
      active.blur && active.blur();
      event.stopPropagation();
      event.preventDefault();
    }
    return;
  }

  if (actionName) {
    const action = actionMap[actionName];
    if (action) action();
    event.stopPropagation();
    event.preventDefault();
  }
});

const titleByAction: Record<string, string> = {
  cut: 'Couper (Ctrl+X)',
  copy: 'Copier (Ctrl+C)',
  paste: 'Coller (Ctrl+V)',
  pasteIn: 'Coller dans (Ctrl+Shift+V)',
  add: 'Ajouter (Ctrl+Plus)',
  addIn: 'Ajouter dans (Ctrl+Shift+Plus)',
  remove: 'Supprimer (Ctrl+Suppr)',
  hide: 'Cacher (Suppr)',
  show: 'Montrer (Suppr)',
  up: 'En haut (Ctrl+Haut)',
  down: 'En bas (Ctrl+Bas)',
  left: 'Placer dans le parent (Ctrl+Gauche)',
  right: "Placer dans l'enfant (Ctrl+Droite)",
  hLeft: 'À gauche',
  hCenter: 'Au centre',
  hRight: 'À droite',
  hStretch: 'Étirement horizontal',
  vTop: 'En Haut',
  vMiddle: 'Au Milieu',
  vBottom: 'En Bas',
  vStretch: 'Étirement vertical',
  tLeft: 'Texte à gauche',
  tCenter: 'Texte au centre',
  tRight: 'Texte à droite',
  tJustify: 'Texte Justifier',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
};

const Action = ({ name, ...props }: ButtonProps & { name: string }) => {
  return (
    <Button
      {...tooltip(titleByAction[name] || '')}
      {...props}
      onClick={() => {
        try {
          const action = actionMap[name];
          if (action) action();
        } catch (error) {
          console.error('actionMap', name, error);
        }
      }}
    />
  );
};

const c = Css('EdActions', {
  '': {
    border: '1px solid grey',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    p: 1,
  },
  Row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export const EdActions = () => {
  const select = useFlux(B.select$) || B.root;
  useFlux(select.update$);
  return (
    <div {...c()}>
      <div {...c('Row')}>
        <Action name="cut">
          <ClipboardX />
        </Action>
        <Action name="copy">
          <ClipboardCopy />
        </Action>
        <Action name="paste">
          <ClipboardPaste />
        </Action>
        <Action name="pasteIn">
          <ClipboardPaste />
        </Action>
      </div>
      <div {...c('Row')}>
        <Action name="add">
          <CopyPlus />
        </Action>
        <Action name="addIn">
          <AddChildIcon />
        </Action>
        <Action name="remove">
          <Trash />
        </Action>
        {select?.d.hide ?
          <Action name="show">
            <Eye />
          </Action>
        : <Action name="hide">
            <EyeOff />
          </Action>
        }
      </div>
      <div {...c('Row')}>
        <Action name="tLeft">
          <AlignLeft />
        </Action>
        <Action name="tCenter">
          <AlignCenter />
        </Action>
        <Action name="tRight">
          <AlignRight />
        </Action>
        <Action name="tJustify">
          <AlignJustify />
        </Action>
      </div>
      <div {...c('Row')}>
        <Action name="vTop">
          <AlignStartHorizontal />
        </Action>
        <Action name="vMiddle">
          <AlignCenterHorizontal />
        </Action>
        <Action name="vBottom">
          <AlignEndHorizontal />
        </Action>
        <Action name="vStretch">
          <VerticalStretchIcon />
        </Action>
      </div>
      <div {...c('Row')}>
        <Action name="up">
          <MoveUp />
        </Action>
        <Action name="down">
          <MoveDown />
        </Action>
        <Action name="left">
          <MoveLeft />
        </Action>
        <Action name="right">
          <MoveRight />
        </Action>
      </div>
      <div {...c('Row')}>
        <Action name="hLeft">
          <AlignHorizontalJustifyStart />
        </Action>
        <Action name="hCenter">
          <AlignHorizontalJustifyCenter />
        </Action>
        <Action name="hRight">
          <AlignHorizontalJustifyEnd />
        </Action>
        <Action name="hStretch">
          <HorizontalStretchIcon />
        </Action>
      </div>
      <div {...c('Row')}>
        <Action name="json">
          <Braces />
        </Action>
        <Action name="html">
          <Code />
        </Action>
        <Action name="css">
          <Italic />
        </Action>
        <Action name="js">
          <Braces />
        </Action>
      </div>
    </div>
  );
};
