import { clipboardCopy, clipboardPaste } from '@/utils/clipboard';
import { BController } from '../BController';
import { flux, fluxCombine, isItem, isUInt, logger, onHtmlEvent, randColor } from 'fluxio';
import { BData, BNext } from '../bTypes';
import { Api } from '@/api/Api';
import { Router } from '@/controllers/Router';
export type BEditPage = '' | 'tree' | 'player' | 'webview' | 'text' | 'filter' | 'advanced';

export class BEditController extends BController {
  log = logger('BEditController');

  readonly page$ = flux<BEditPage>('');
  readonly selectIndex$ = flux<number | undefined>(undefined);
  readonly select$ = fluxCombine(this.selectIndex$, this.items$).map(([index, items]) =>
    index ? items[index] : undefined
  );

  constructor(api: Api, router: Router) {
    super(api, router);

    this.click$.on((e) => this.selectIndex$.set(e.i));
  }

  ready() {
    console.debug('BViewport ready');

    const pz = this.panZoom;
    const viewporteEl = pz.viewport();
    onHtmlEvent(viewporteEl, 'click', (event) => {
      this.click$.set({ el: viewporteEl, event });
    });

    // this.panZoomFit();
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
          this.cut();
          break;
        case 'ctrl+c':
        case 'meta+c':
          this.copy();
          break;
        case 'ctrl+v':
        case 'meta+v':
          this.paste();
          break;
        case 'backspace':
          this.remove();
          break;
      }
    });
  }

  add(replace: BNext) {
    const i = this.getItems().length;
    this.set(i, replace);
    this.selectIndex$.set(i);
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
    return this.selectIndex$.get();
  }

  getSelect() {
    return this.select$.get();
  }

  getSelectPage() {
    return this.getParent(this.getSelectIndex(), i => i.t === 'page');
  }

  async remove() {
    const index = this.getSelectIndex();
    this.delete(index);
  }

  async cut() {
    const index = this.getSelectIndex();
    const data = this.getData(index);
    await clipboardCopy(data);
    this.delete(index);
  }

  async copy() {
    const index = this.getSelectIndex();
    const data = this.getData(index);
    await clipboardCopy(data);
  }

  async paste() {
    const index = this.getSelectIndex();
    const item = this.get(index);
    if (!item) return;
    const d: BData = await clipboardPaste();
    if (isItem(d)) {
      this.add({ ...d, p: item.t === d.t ? item.p : item.i });
    }
  }

  onReady = () => this.ready();

  onAddPage = () => this.add({ t: 'page', p: 0 });

  onAddZone = () => {
    const page = this.getSelectPage()
    if (page) {
      this.add({
        t: 'zone',
        a: [25, 25, 50, 50],
        s: { bg: randColor() },
        p: page.i,
      });
    }
  }

  onAddTimeline = () => {}

  onAddMedia = () => {}

  onAddWeb = () => {}

  onSave = () => {}
}
