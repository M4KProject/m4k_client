import { JSX } from 'preact';
import { useTr } from '../hooks/useTr';
import { isString } from 'fluxio';

export interface TrProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: any;
}

export const Tr = ({ children }: TrProps) => {
  const tr = useTr();
  return isString(children) ? tr(children) : children;
};
