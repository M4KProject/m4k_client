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
import B from './B';
import { panel$, terminal$ } from './flux';
import { moveItem } from 'fluxio';
import { useFlux } from '@common/hooks';

function AddChildIcon(props: any) {
  return <AddToPhotosTwoTone {...props} style={{ transform: 'rotate(90deg)' }} />;
}

function HorizontalStretchIcon() {
  return (
    <SvgIcon>
      <path d="M2 2v20h2V2Zm18 0v20h2V2ZM6 7v3h12V7Zm0 7v3h12v-3z"></path>
    </SvgIcon>
  );
}

function VerticalStretchIcon() {
  return (
    <SvgIcon>
      <path d="M2 2v2h20V2Zm5 4v12h3V6Zm7 0v12h3V6ZM2 20v2h20v-2z"></path>
    </SvgIcon>
  );
}

function update(changes?: Partial<D> | null) {
  if (!changes) return;
  getSelect().update(changes);
}

function updateStyle(changes?: Partial<DStyle> | null) {
  if (!changes) return;
  getSelect().updateStyle(changes);
}

function flexRow() {
  const s = getComputedStyle(getSelect().el);
  if (s.display !== 'flex' || !s.flexDirection) {
    getSelect().updateStyle({ display: 'flex', flexDirection: 'column' });
    return false;
  }
  return s.flexDirection === 'row';
}

function setPanel(name: string) {
  panel$.set(name);
}

function move(addIndex: number) {
  const b = getSelect();
  if (!b.parent) return;
  const children = [...(b.parent.d.children || [])];
  if (moveItem(children, b.d, addIndex)) {
    b.parent.update({ children });
    const index = (b.parent.d.children || []).indexOf(b.d);
    setSelect(b.parent.children[index]);
  }
}

function left() {
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
}

function right() {
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
}

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

  hLeft: () => updateStyle(flexRow() ? { justifyContent: 'flex-start' } : { alignItems: 'flex-start' }),
  hCenter: () => updateStyle(flexRow() ? { justifyContent: 'center' } : { alignItems: 'center' }),
  hRight: () => updateStyle(flexRow() ? { justifyContent: 'flex-end' } : { alignItems: 'flex-end' }),
  hStretch: () => updateStyle(flexRow() ? { justifyContent: 'stretch' } : { alignItems: 'stretch' }),

  vTop: () => updateStyle(flexRow() ? { alignItems: 'flex-start' } : { justifyContent: 'flex-start' }),
  vMiddle: () => updateStyle(flexRow() ? { alignItems: 'center' } : { justifyContent: 'center' }),
  vBottom: () => updateStyle(flexRow() ? { alignItems: 'flex-end' } : { justifyContent: 'flex-end' }),
  vStretch: () => updateStyle(flexRow() ? { alignItems: 'stretch' } : { justifyContent: 'stretch' }),

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
    actionMap[actionName]();
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

function Action({ name, ...props }: IconButtonProps & { name: string }) {
  return (
    <Tooltip title={titleByAction[name] || ''}>
      <IconButton
        {...props}
        onClick={() => {
          try {
            actionMap[name]();
          } catch (error) {
            console.error('actionMap', name, error);
          }
        }}
      />
    </Tooltip>
  );
}

export default function Props() {
  const select = useFlux(B.select$) || B.root;
  useFlux(select.update$);
  return (
    <Box
      className="Action"
      sx={{
        border: '1px solid grey',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        p: 1,
        '& .ActionRow': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        },
        '& .ActionRow-primary .MuiIconButton-root': {
          color: 'primary.main',
        },
        '& .MuiIconButton-root': {
          p: 0.5,
          '& svg': {
            width: '0.8em',
            height: '0.8em',
          },
        },
      }}
    >
      <div className="ActionRow ActionRow-primary">
        <Action name="cut">
          <CutIcon />
        </Action>
        <Action name="copy">
          <CopyIcon />
        </Action>
        <Action name="paste">
          <PasteIcon />
        </Action>
        <Action name="pasteIn">
          <PasteChildIcon />
        </Action>
      </div>
      <div className="ActionRow ActionRow-primary">
        <Action name="add">
          <AddIcon />
        </Action>
        <Action name="addIn">
          <AddChildIcon />
        </Action>
        <Action name="remove">
          <RemoveIcon />
        </Action>
        {select?.d.hide ? (
          <Action name="show">
            <ShowIcon />
          </Action>
        ) : (
          <Action name="hide">
            <HideIcon />
          </Action>
        )}
      </div>
      <div className="ActionRow ActionRow-primary">
        <Action name="tLeft">
          <TextLeftIcon />
        </Action>
        <Action name="tCenter">
          <TextCenterIcon />
        </Action>
        <Action name="tRight">
          <TextRightIcon />
        </Action>
        <Action name="tJustify">
          <TextJustifyIcon />
        </Action>
      </div>
      <div className="ActionRow ActionRow-primary">
        <Action name="vTop">
          <VerticalTopIcon />
        </Action>
        <Action name="vMiddle">
          <VerticalMiddleIcon />
        </Action>
        <Action name="vBottom">
          <VerticalBottomIcon />
        </Action>
        <Action name="vStretch">
          <VerticalStretchIcon />
        </Action>
      </div>
      <div className="ActionRow">
        <Action name="up">
          <UpIcon />
        </Action>
        <Action name="down">
          <DownIcon />
        </Action>
        <Action name="left">
          <LeftIcon />
        </Action>
        <Action name="right">
          <RightIcon />
        </Action>
      </div>
      <div className="ActionRow">
        <Action name="hLeft">
          <HorizontalLeftIcon />
        </Action>
        <Action name="hCenter">
          <HorizontalCenterIcon />
        </Action>
        <Action name="hRight">
          <HorizontalRightIcon />
        </Action>
        <Action name="hStretch">
          <HorizontalStretchIcon />
        </Action>
      </div>
      <div className="ActionRow">
        <Action name="json">
          <JsonIcon />
        </Action>
        <Action name="html">
          <HtmlIcon />
        </Action>
        <Action name="css">
          <CssIcon />
        </Action>
        <Action name="js">
          <JsIcon />
        </Action>
      </div>
      {/* <div className="PropsActionRow">
                <IconButton><ReorderIcon /></Action>
                <IconButton><ColorLensIcon /></Action>
                <IconButton><ColorizeIcon /></Action>
                <IconButton><FavoriteIcon /></Action>
            </div> */}
    </Box>
  );
}
