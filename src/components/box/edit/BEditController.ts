import { clipboardCopy, clipboardPaste } from '@/utils/clipboard';
import { BController } from '../BController';
import { flux, fluxCombine, isItem, isUInt, logger, onHtmlEvent, randColor } from 'fluxio';
import { BData, BNext, NBItem } from '../bTypes';
import { Api } from '@/api/Api';
import { Router } from '@/controllers/Router';
import { openBMediasWindow } from './BMediasWindow';

export type BEditSideName = '' | 'tree' | 'media' | 'web' | 'text' | 'filter' | 'advanced';

export interface HistoryContext {
  prev: readonly NBItem[];
  prevUndo: (readonly NBItem[])[];
  prevRedo: (readonly NBItem[])[];
  undo: (readonly NBItem[])[];
  redo: (readonly NBItem[])[];
  next?: readonly NBItem[];
}

export class BEditController extends BController {
  log = logger('BEditController');

  readonly side$ = flux<BEditSideName>('');
  readonly selectId$ = flux<number | undefined>(undefined);
  readonly select$ = fluxCombine(this.selectId$, this.items$).map(([index, items]) =>
    isUInt(index) ? items[index] : undefined
  );
  readonly player$ = fluxCombine(this.selectId$, this.items$).map(([id]) => this.getParent(id, p => p.t === 'player'));
  readonly playerChildren$ = fluxCombine(this.player$, this.items$).map(([player]) => this.getChildren(player));

  isEditHistory = false;
  readonly undo$ = flux<(readonly NBItem[])[]>([]);
  readonly redo$ = flux<(readonly NBItem[])[]>([]);

  constructor(api: Api, router: Router) {
    super(api, router);
    this.log.d('constructor');

    this.click$.on((e) => {
      this.log.d('click', e);
      this.selectId$.set(e.i);
    });

    this.items$.on(items => {
      this.log.d('items', items, this.isEditHistory);
      if (this.isEditHistory) return;
      this.undo$.set(prev => [...prev, items]);
      this.redo$.set([]);
    });
  }

  panZoomFit() {
    const pz = this.panZoom;
    if (!pz) return;
    setTimeout(() => pz.fitToContainer(), 100);
    setTimeout(() => pz.fitToContainer(), 1000);
  }

  bindKeyDown() {
    return onHtmlEvent(0, 'keydown', (e) => {
      const key = (
        (e.ctrlKey ? 'ctrl+' : '') +
        (e.metaKey ? 'meta+' : '') +
        (e.shiftKey ? 'shift+' : '') +
        (e.altKey ? 'alt+' : '') +
        e.key
      ).toLowerCase();

      console.debug('keydown', e.metaKey, key, e);

      switch (key) {
        case 'ctrl+x':
        case 'meta+x':
          this.onCut();
          break;
        case 'ctrl+c':
        case 'meta+c':
          this.onCopy();
          break;
        case 'ctrl+v':
        case 'meta+v':
          this.onPaste();
          break;
        case 'backspace':
          this.onDelete();
          break;
      }
    });
  }

  add(replace: BNext) {
    const i = this.getItems().length;
    this.set(i, replace);
    this.selectId$.set(i);
    return i;
  }

  delete(index?: number) {
    this.log.d('delete', index);
    if (!isUInt(index)) return false;
    const prev = this.get(index);
    if (!prev) return false;
    const items = this.getItems();
    this.items$.set(this.applyChanges([...items], index, prev, undefined));
    return true;
  }

  getSelectIndex() {
    return this.selectId$.get();
  }

  getSelect() {
    return this.select$.get();
  }

  getSelectPage() {
    return this.getParent(this.getSelectIndex(), (i) => i.t === 'page');
  }

  onDelete = async () => {
    const index = this.getSelectIndex();
    this.delete(index);
  }

  onCut = async () => {
    const index = this.getSelectIndex();
    const data = this.getData(index);
    await clipboardCopy(data);
    this.delete(index);
  }

  onCopy = async () => {
    const index = this.getSelectIndex();
    const data = this.getData(index);
    await clipboardCopy(data);
  }

  onPaste = async () => {
    const index = this.getSelectIndex();
    const item = this.get(index);
    if (!item) return;
    const d: BData = await clipboardPaste();
    if (isItem(d)) {
      this.add({ ...d, p: item.t === d.t ? item.p : item.i });
    }
  }

  onReady = () => {
    this.log.d('onReady');

    const pz = this.panZoom;
    const viewporteEl = pz.viewport();
    onHtmlEvent(viewporteEl, 'click', (event) => {
      this.click$.set({ el: viewporteEl, event });
    });

    // this.panZoomFit();
  }

  onAddPage = () => {
    this.log.d('onAddPage');
    this.add({ t: 'page', p: 0 });
  }

  onAddZone = () => {
    this.log.d('onAddZone');
    const page = this.getSelectPage();
    if (page) {
      this.add({
        t: 'zone',
        a: [25, 25, 50, 50],
        s: { bg: randColor() },
        p: page.i,
      });
    }
  };

  onAddTimeline = () => {
    this.log.d('onAddTimeline');
  };

  onAddMedia = (e: Event) => {
    this.log.d('onAddMedia');
    openBMediasWindow(e);
  };

  onUpdateMedia = () => {
    this.log.d('onUpdateMedia');
  };

  onAddWeb = () => {
    this.log.d('onAddWeb');
  };

  history(apply: (ctx: HistoryContext) => void) {
    const prev = this.items$.get();
    const prevUndo = this.undo$.get();
    const prevRedo = this.redo$.get();
    const undo = [...prevUndo];
    const redo = [...prevRedo];

    const ctx: HistoryContext = { prev, prevUndo, prevRedo, undo, redo };
    apply(ctx);

    if(!ctx.next) return;

    this.isEditHistory = true;

    this.items$.set(ctx.next);
    this.undo$.set(ctx.undo);
    this.redo$.set(ctx.redo);

    this.isEditHistory = false;
  }

  onUndo = () => {
    this.history(ctx => {
      const prev = ctx.undo.pop();
      if (prev) {
        ctx.next = prev;
        ctx.redo.push(ctx.prev);
      }
      this.log.d('onUndo', ctx);
    });
  };

  onRedo = () => {
    this.history(ctx => {
      const next = ctx.redo.pop();
      if (next) {
        ctx.next = next;
        ctx.undo.push(ctx.prev);
      }
      this.log.d('onRedo', ctx);
    });
  };

  onSave = () => {
    this.log.d('onSave');
  };

  onCancel = () => {
    this.log.d('onCancel');
    this.router.go({ page: 'medias' });
  };
}
