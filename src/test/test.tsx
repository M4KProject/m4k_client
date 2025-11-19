import { render } from 'preact';
import { FieldsTestPage } from './FieldsTestPage';
import { refreshTheme } from '../utils/theme';
import { addFont } from '../utils/addFont';

// Initialize theme and fonts
addFont('Roboto');
refreshTheme();

// Mount the test page
const root = document.getElementById('app');
if (root) {
  render(<FieldsTestPage />, root);
}
