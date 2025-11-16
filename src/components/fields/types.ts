import { ComponentChildren } from 'preact';
import { DivProps } from '@/components/types';
import { Flux } from 'fluxio';

export type FieldComp<T = any> = (props: {
  cls?: string;
  name: string | undefined;
  required?: boolean;
  value: T;
  onChange: (e: any) => void;
  onBlur?: () => void;
  fieldProps: FieldProps<T>;
}) => ComponentChildren;

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
  | 'image'
  | 'doc'
  | 'date'
  | 'datetime'
  | 'seconds';

export interface FieldInfo<T = any> {
  col?: boolean;
  type?: FieldType;
  name?: string;
  label?: ComponentChildren;
  helper?: ComponentChildren;
  error?: ComponentChildren;
  items?: ([T, ComponentChildren] | false | null | undefined)[];
  required?: boolean;
  readonly?: boolean;
  castType?: string;
  props?: any;
}

export interface FluxFieldProps<T = any> extends FieldInfo, DivProps {
  flux: Flux<T>;
  children?: ComponentChildren;
}

export interface FieldProps<T = any> extends FieldInfo, DivProps {
  msg?: Flux<T>;
  value?: T;
  cast?: (next: any) => T;
  onValue?: (next: T) => void;
  delay?: number;
  Comp?: FieldComp;
  children?: ComponentChildren;
}
