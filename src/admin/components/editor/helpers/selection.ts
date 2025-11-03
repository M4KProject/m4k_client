import { B } from '../B';

let lastSelectEl: HTMLElement | null = null;

export const setupSelectionListener = () => {
  B.select$.on((b) => {
    const active = document.activeElement;
    if (active && (active as HTMLElement).blur) {
      (active as HTMLElement).blur();
    }

    while (lastSelectEl) {
      lastSelectEl.classList.remove('ed-selected');
      lastSelectEl = lastSelectEl.parentElement;
    }
    if (!b) return;
    let el: HTMLElement | null = (lastSelectEl = b.el);
    while (el) {
      el.classList.add('ed-selected');
      el = el.parentElement;
    }
  });
};
