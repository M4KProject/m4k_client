import { isDefined, isString, Css } from 'fluxio';
import { useInputProps } from '@/components/fields/hooks';
import { FieldProps } from '@/components/fields/types';
import { useEffect, useRef } from 'preact/hooks';

const c = Css('Multiline', {
  '': {
    resize: 'none',
    overflow: 'auto',
    hMin: '2.5rem',
    hMax: 'calc(2.5rem * 10)',
    lineHeight: '1.5',
  },
});

const Multiline = () => {
  const props = useInputProps();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();
  }, [props.value]);

  return <textarea ref={textareaRef} {...props} {...c('', props)} />;
};

const multiline: FieldProps<string, string> = {
  input: Multiline,
};

const json: FieldProps<any, string> = {
  input: Multiline,
  toRaw: (value: any) => {
    try {
      return isDefined(value) ? JSON.stringify(value, undefined, 2) : undefined;
    } catch (error) {
      console.error('json toRaw error', value, error);
      throw error;
    }
  },
  toValue: (value: any) => {
    try {
      return isString(value) ? JSON.parse(value) : undefined;
    } catch (error) {
      console.error('json toValue error', value, error);
      throw error;
    }
  },
};

export const multilineInputs = {
  multiline,
  json,
};
