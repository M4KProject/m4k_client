import { Css } from 'fluxio';

export const FIELD_HEIGHT = 22;
export const LABEL_WIDTH = 200;

export const fieldStyle = Css('Field', {
  '': {
    row: 'center',
    my: 4,
    w: '100%',
    hMin: FIELD_HEIGHT,
  },
  Group: {
    row: ['center', 'between'],
  },
  '-col': {
    col: ['stretch', 'start'],
  },
  '-error &Label': { fg: 'error' },
  '-error &Input': { border: 'error' },
  Error: { fg: 'error' },
  Label: {
    // flex: 1,
    textAlign: 'left',
    opacity: 0.6,
    fg: 't',
    w: LABEL_WIDTH,
  },
  Content: {
    row: ['center', 'start'],
    flex: 2,
    hMin: 16,
  },
  'Content > .Field:not(:first-child)': {
    ml: 4,
  },
  Input: {
    w: '100%',
    hMin: FIELD_HEIGHT,
    py: 2,
    px: 8,
    border: 'border',
    rounded: 5,
    outline: 'none',
    bg: 'bg',
    fg: 't',
    fontSize: '1rem',
    // elevation: 1,
  },
  'Input:hover': {
    borderColor: 'border',
  },

  // Régle la couleur de l'autocompletion
  'Input:autofill': {
    '-webkit-text-fill-color': 'black',
    '-webkit-box-shadow': '0 0 0 1000px white inset',
    caretColor: 'black',
  },

  // Styles pour les flèches de l'input number (Chrome/Safari/Edge)
  'Input::-webkit-inner-spin-button': {
    opacity: 1,
    backgroundColor: 'white',
    color: 'black',
    cursor: 'pointer',
  },
  'Input::-webkit-outer-spin-button': {
    opacity: 1,
    backgroundColor: 'white',
    color: 'black',
    cursor: 'pointer',
  },

  '-check &Input': {
    center: 1,
    p: 0,
    mx: 4,
    whMin: FIELD_HEIGHT,
    whMax: FIELD_HEIGHT,
    cursor: 'pointer',
    border: 'border',
    bg: 'bg',
    position: 'relative',
    rounded: 3,
    transition: 0.3,
    boxSizing: 'border-box',
  },
  '-check &Input-selected': {
    borderColor: 'p',
    bg: 'p',
  },
  '-check &Input svg': {
    fg: 'handle',
    transition: 0.3,
    scale: 0,
  },
  '-check &Input-selected svg': {
    scale: 1,
  },

  '-switch &Input': {
    center: 1,
    w: FIELD_HEIGHT * 2,
    cursor: 'pointer',
    border: 'border',
    bg: 'bg',
    position: 'relative',
    rounded: 99,
    transition: 0.3,
  },
  '-switch &Input-selected': { borderColor: 'p', bg: 'p' },

  '-switch &InputHandle': {
    wh: FIELD_HEIGHT - 4,
    bg: 'handle',
    rounded: 99,
    position: 'absolute',
    elevation: 1,
    transition: 0.3,
    translateX: -(FIELD_HEIGHT - 4) + 'px',
  },
  '-switch &Input-selected &InputHandle': { translateX: FIELD_HEIGHT - 4 + 'px' },
});
