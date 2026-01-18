import { useRef } from 'preact/hooks';
import { Css, Dictionary, Style } from 'fluxio';
import { Tr } from './Tr';
import { Props } from './types';
import { tooltipProps } from './Tooltip';
import { comp, Comp } from '@/utils/comp';

const addColors = () => {
  const styles: Dictionary<Style> = {};
  const colors = ['primary', 'secondary', 'success', 'warn', 'error'];
  for (const color of colors) {
    styles[`-${color}`] = { bg: color, fg: 'handle' };
    styles[`-icon&-${color}`] = { fg: color };
    styles[`-selected&-icon&-${color}`] = { bg: color };
    styles[`:hover&-icon&-${color}`] = { bg: color };
  }
  // console.debug('addColors', styles);
  return styles;
};

const c = Css('Button', {
  '': {
    row: ['center', 'start'],
    position: 'relative',
    m: 2,
    p: 2,
    rounded: 5,
    border: 0,
    bg: 'btn',
    fg: 'fg',
    whMin: 20,
    elevation: 1,
    transition: 0.5,
    bold: 1,
    fontSize: 'inherit',
    overflow: 'hidden',
  },
  Sfx: {
    position: 'absolute',
    inset: 0,
    bg: 'secondary',
    transition: 0.5,
    scaleX: 0,
    transformOrigin: 'left',
  },
  Content: {
    position: 'relative',
    row: ['center', 'start'],
    m: 2,
    flex: 1,
    textAlign: 'left',
  },

  '-icon &Content': {
    display: 'none',
  },
  Icon: {
    position: 'relative',
    center: 1,
    m: 2,
    rounded: 5,
  },

  ':active': { bg: 'primary', fg: 'handle' },
  '-selected': { bg: 'primary', fg: 'handle' },
  ':hover': { elevation: 0, fg: 'handle' },
  ':hover > &Sfx': { scaleX: 1 },

  ...addColors(),

  '-icon': { bg: 'transparent', fg: 'fg', elevation: 0, border: 0 },
  '-selected&-icon,:hover&-icon': { bg: 'primary', fg: 'handle', border: 0 },

  '-big': { col: ['stretch', 'center'], p: 8 },
  '-big &Icon svg': { whMin: 48 },
  '-big &Content': { flex: 0 },
});

type BaseButtonProps = Omit<Omit<Props['button'] & Props['a'], 'onClick'>, 'title'> & {
  onClick?: (e: Event) => void;
};

export interface ButtonProps extends BaseButtonProps {
  class?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warn' | 'error';
  variant?: 'upload';
  big?: boolean;
  selected?: boolean;
  icon?: Comp | true;
  before?: Comp;
  title?: Comp;
  link?: boolean;
  tooltip?: Comp;
}

export const Button = ({
  title,
  color,
  variant,
  selected,
  icon,
  children,
  before,
  link,
  tooltip,
  big,
  ...props
}: ButtonProps) => {
  const isIcon = icon === true || (icon && !(children || title));

  const clsProps = c(
    '',
    `-${color || 'default'}`,
    selected && `-selected`,
    isIcon ? `-icon` : null,
    variant && `-${variant}`,
    big && `-big`,
    props
  );

  const content = (
    <>
      <div {...c('Sfx')} />
      {comp(before)}
      {icon && icon !== true && <div {...c('Icon')}>{comp(icon)}</div>}
      <div {...c('Content')}>
        {comp(title)}
        {children}
      </div>
    </>
  );

  if (link) {
    return (
      <a {...props} {...clsProps}>
        {content}
      </a>
    );
  }

  return (
    <button {...props} {...clsProps} {...tooltipProps(tooltip)}>
      {content}
    </button>
  );
};

export interface UploadButtonProps extends ButtonProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  icon?: Comp;
}

export const UploadButton = ({
  onClick,
  onFiles,
  accept,
  multiple,
  ...props
}: UploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      variant="upload"
      onClick={(event) => {
        if (onClick) onClick(event);
        inputRef.current?.click();
      }}
      {...props}
      before={
        <input
          style={{ display: 'none' }}
          type="file"
          ref={inputRef}
          accept={accept}
          multiple={multiple || true}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            const files = Array.from(target.files || []);
            if (onFiles) onFiles(files);
            if (inputRef.current) inputRef.current.value = '';
          }}
        />
      }
    />
  );
};
