import { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { Css } from 'fluxio';
import { Tr } from './Tr';
import { Props } from './types';

const c = Css('Button', {
  '': {
    row: ['center', 'start'],
    position: 'relative',
    m: 2,
    p: 2,
    rounded: 5,
    border: 0,
    bg: 'transparent',
    fg: 'w2',
    whMin: 20,
    elevation: 1,
    transition: 0.5,
    bold: 1,
    fontSize: 'inherit',
  },
  Sfx: {
    position: 'absolute',
    inset: 0,
    bg: 's5',
    transition: 0.5,
    scaleX: 0,
    transformOrigin: 'left',
    rounded: 5,
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

  '-primary': { bg: 'p5' },
  '-secondary': { bg: 's4' },
  '-success': { bg: 'success' },
  '-warn': { bg: 'warn' },
  '-error': { bg: 'error' },
  '-default': { bg: 'b1', fg: 't2' },

  '-icon': { m: 0, bg: 'transparent', elevation: 0 },
  '-icon&-primary': { fg: 'p5' },
  '-icon&-secondary': { fg: 's4' },
  '-icon&-success': { fg: 'success' },
  '-icon&-warn': { fg: 'warn' },
  '-icon&-error': { fg: 'error' },
  '-icon&-default': { fg: 't2' },

  ':active': { bg: 'p4', fg: 'w2' },
  '-selected': { bg: 'p4', fg: 'w2' },

  ':hover &Sfx': { scaleX: 1 },
  ':hover': { elevation: 0, fg: 'w0' },
});

type BaseButtonProps = Omit<Props['button'] & Props['a'], 'onClick'> & {
  onClick?: (e: Event) => void;
};

export interface ButtonProps extends BaseButtonProps {
  class?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warn' | 'error';
  variant?: 'upload';
  selected?: boolean;
  icon?: ComponentChildren;
  before?: ComponentChildren;
  title?: string;
  link?: boolean;
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
  ...props
}: ButtonProps) => {
  const isIcon = icon && !(children || title);

  const clsProps = c(
    '',
    `-${color || 'default'}`,
    selected && `-selected`,
    isIcon ? `-icon` : null,
    variant && `-${variant}`,
    props
  );

  const content = (
    <>
      <div {...c('Sfx')} />
      {before}
      {icon && <div {...c('Icon')}>{icon}</div>}
      <div {...c('Content')}>
        {title && <Tr>{title}</Tr>}
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
    <button {...props} {...clsProps}>
      {content}
    </button>
  );
};

export interface UploadButtonProps extends ButtonProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  icon?: ComponentChildren;
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
