import { createRoot } from 'react-dom/client'
import { addResponsiveListener, El, setTheme } from '@common/helpers'
import { App } from './components/App'
import { m4k } from '@common/m4k';
import copyPlaylist from './copyPlaylist';
import { deviceInit } from './services/device';

const init = async () => {
  addResponsiveListener();
  setTheme('#25a6d8');

  const rootEl = El('div', { id: 'm4kControl', parent: 'body' });
  createRoot(rootEl).render(<App />);

  deviceInit();

  // if (!m4k) return;
  m4k.subscribe(async e => {
    if (e.type !== 'storage' || e.action !== 'mounted') return;

    const copyDir = await m4k.get('copyDir') || 'playlist';
    if (!copyDir) return;

    await copyPlaylist(`${e.path}/${copyDir}`);
  });
}

init();