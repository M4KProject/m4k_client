import { render } from 'preact';
import { WindowTestPage } from './WindowTestPage';
import { refreshTheme } from '../utils/theme';
import { addFont } from '../utils/addFont';

// Initialize theme and fonts
addFont('Roboto');
refreshTheme();

// Mount the test page
const root = document.getElementById('app');
if (root) {
  render(<WindowTestPage />, root);
}
