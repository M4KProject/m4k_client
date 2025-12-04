import type { ComponentChildren } from 'preact';
import type { DivProps } from '@/components/common/types';

export type SelectItems<V> = ([V, ComponentChildren] | false | null | undefined)[];

export interface FieldProps<V, R> {
  type?: FieldType;
  name?: string;
  items?: SelectItems<V>;
  required?: boolean;
  readonly?: boolean;
  stored?: string;
  value?: V;
  onValue?: (next: V) => void;
  input?: () => ComponentChildren;
  props?: any;
  error?: ComponentChildren;
  min?: V;
  max?: V;

  delay?: number;
  toRaw?: (value: V) => R | undefined;
  toValue?: (raw: R, e: Event) => V | undefined;

  col?: boolean;
  label?: ComponentChildren;
  placeholder?: string;
  helper?: ComponentChildren;
  clearable?: boolean;
  containerProps?: DivProps;
  children?: DivProps['children'];
  tooltip?: string;
}

export interface FieldState<V, R> {
  readonly value?: V;
  readonly raw?: R;
  readonly error?: any;
  readonly event?: any;
  readonly config: Readonly<FieldProps<V, R>>;
}

export type FieldComponent<V, R> = (props: FieldProps<V, R>) => ComponentChildren;

export type FieldType =
  | 'email'
  | 'password'
  | 'text'
  | 'multiline'
  | 'json'
  | 'color'
  | 'number'
  | 'select'
  | 'picker'
  | 'switch'
  | 'check'
  | 'date'
  | 'datetime'
  | 'seconds'
  | 'upload';
