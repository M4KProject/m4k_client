import { JSX } from 'preact';
import { Css } from 'fluxio';

const c = Css('Table', {
  '': {
    border: 0,
    borderCollapse: 'collapse',
    m: 4,
  },

  Row: {
    borderCollapse: 'collapse',
    w: '100%',
    bg: 'b0',
    fg: 't2',
    h: 3,
  },

  'Row-success': { fg: 'success' },
  'Row-error': { fg: 'error' },
  'Row-selected': { fg: 'selected' },
  'Row:nth-child(even)': { bg: 'b2', rounded: 2 },
  'Row:hover': { bg: 'trHover' },

  Cell: {
    border: 0,
    textAlign: 'left',
  },
  CellContent: {
    position: 'relative',
    col: ['stretch', 'center'],
    px: 4,
    h: 3,
  },
  'Cell-row &CellContent': {
    row: ['center', 'start'],
  },
  'Cell-center &CellContent': {
    center: 1,
  },
  'Cell-around &CellContent': {
    row: ['center', 'around'],
  },
  'Cell-actions': {
    w: 0,
  },
  'Cell-actions &CellContent': {
    row: ['center', 'end'],
    p: 0,
  },
  'Cell-actions .Button': {
    m: 2,
  },
  'Cell-check': {
    width: 0,
  },
  ' input': {
    background: 'transparent',
    border: 0,
  },

  RowHead: {
    bg: 'b0',
  },
  CellHead: {
    fg: 't2',
  },
  'CellHead &CellContent': {
    h: 2.5,
  },
});

export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {}
export const Table = (props: TableProps) => <table {...props} {...c('', props)} />;

export interface TableHeadProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {}
export const TableHead = (props: TableHeadProps) => <thead {...props} {...c('Head', props)} />;

export interface TableBodyProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {}
export const TableBody = (props: TableBodyProps) => <tbody {...props} {...c('Body', props)} />;

export interface TableFootProps extends JSX.HTMLAttributes<HTMLTableSectionElement> {}
export const TableFoot = (props: TableFootProps) => <tfoot {...props} {...c('Foot', props)} />;

export interface RowProps extends JSX.HTMLAttributes<HTMLTableRowElement> {
  mode?: 'success' | 'error' | 'selected';
}
export const Row = (props: RowProps) => (
  <tr {...props} {...c('Row', props.mode && `Row-${props.mode}`, props)} />
);

export interface CellProps extends JSX.HTMLAttributes<HTMLTableCellElement> {
  variant?: 'row' | 'center' | 'around' | 'check' | 'actions';
}
export const Cell = ({ variant, children, ...props }: CellProps) => (
  <td {...props} {...c('Cell', variant && `Cell-${variant}`, props)}>
    <div {...c('CellContent')}>{children}</div>
  </td>
);

export interface RowHeadProps extends JSX.HTMLAttributes<HTMLTableRowElement> {}
export const RowHead = (props: RowProps) => (
  <>
    <div {...c('RowHeadBg')} />
    <tr {...props} {...c('RowHead', props)} />
  </>
);

export interface CellHeadProps extends JSX.HTMLAttributes<HTMLTableCellElement> {
  variant?: 'row' | 'center';
}
export const CellHead = ({ variant, children, ...props }: CellHeadProps) => (
  <th {...props} {...c('CellHead', variant && `Cell-${variant}`, props)}>
    <div {...c('CellContent')}>{children}</div>
  </th>
);
