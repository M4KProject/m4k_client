import { clipboardCopy, clipboardPaste } from '@/utils/clipboard';
import { BController } from '../BController';
import { isItem, isUInt, logger, onHtmlEvent, randColor } from 'fluxio';
import { BData, BNext } from '../bTypes';
import { getSingleton } from '@/utils/ioc';
import { Router } from '@/controllers/Router';

export class BEditController extends BController {
  log = logger('BEditController');

  async save() {
    const boxes = this.getAllData();
    this.log.d('save', this.playlistKey, boxes);
    await this.api.media.update(this.playlistKey, {
      data: { boxes },
    });
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
    })
  }

  add(replace: BNext) {
    const i = this.getItems().length;
    this.set(i, replace);
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

  addRect() {
    this.add({
      a: [25, 25, 50, 50],
      s: { bg: randColor() },
      p: this.select$.get()?.i,
    });
  };
  
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
}
