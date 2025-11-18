import type { ComponentChildren } from 'preact';
import type { DivProps } from '@/components/types';

export type SelectItems<T = any> = ([T, ComponentChildren] | false | null | undefined)[];

export interface FieldProps<T = any> {
  type?: FieldType;
  name?: string;
  items?: SelectItems<T>;
  required?: boolean;
  readonly?: boolean;
  stored?: string;
  value?: T;
  onValue?: (next: T) => void;
  input?: () => ComponentChildren;
  props?: any;
  error?: ComponentChildren;
  min?: T;
  max?: T;

  delay?: number;
  convert?: (value: any) => any;
  reverse?: (value: any) => any;

  col?: boolean;
  label?: ComponentChildren;
  placeholder?: string;
  helper?: ComponentChildren;
  containerProps?: DivProps;
  children?: DivProps['children'];
}

export type FieldComponent = (props: FieldProps) => ComponentChildren;

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
