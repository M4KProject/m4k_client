import { CssStyle } from 'fluxio';
import { JSX } from 'preact';

export type GetProps<T> = Omit<T, 'style'> & { style?: CssStyle | any };

export type Props = {
  [K in keyof JSX.IntrinsicElements]: GetProps<JSX.IntrinsicElements[K]>;
};

export type DivProps = Props['div'];
