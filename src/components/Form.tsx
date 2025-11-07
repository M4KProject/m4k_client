import { Css } from 'fluxio';
import { JSX } from 'preact/jsx-runtime';

const c = Css('Form', {
  '': {
    col: 'stretch',
    m: 8,
    p: 8,
  },
  Title: {
    col: ['start', 'end'],
    py: 4,
    color: 'p8',
    bold: 1,
    // borderBottom: '1px solid #0a536f',
  },
});

type FormHTMLProps = JSX.HTMLAttributes<HTMLFormElement>;
export interface FormProps extends Omit<FormHTMLProps, 'style'> {
  class?: string;
  style?: string | JSX.CSSProperties | undefined;
}

export const Form = ({ children, title, onSubmit, ...props }: FormProps) => {
  return (
    <form
      {...props}
      {...c('', props)}
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
      }}
    >
      {title && <div {...c('Title')}>{title}</div>}
      {children}
    </form>
  );
};
