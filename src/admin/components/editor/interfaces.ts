import { B } from './B';
import { D } from './D';

export interface PProps {
  b?: B;
  p?: keyof D;
  v: any;
  setV: (val: any) => void;
  text: string;
  setText: (text: string) => void;
}
