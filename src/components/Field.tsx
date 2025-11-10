import { Css, jsonParse, jsonStringify } from 'fluxio';
import { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { toNumber } from 'fluxio';
import { DivProps } from './types';
import { Tr } from './Tr';
import { Select } from './Select';
import { Picker } from './Picker';
import { toError } from 'fluxio';
import { Check, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { Flux } from 'fluxio';
import { useFlux } from '../hooks/useFlux';
import { Dictionary } from 'fluxio';
import { formatSeconds, parseSeconds } from 'fluxio';

export const FIELD_HEIGHT = 22;
export const LABEL_WIDTH = 200;

const c = Css('Field', {
  '': {
    row: 'center',
    my: 4,
    w: '100%',
    hMin: FIELD_HEIGHT,
  },
  Group: {
    row: ['center', 'between'],
  },
  '-col': {
    col: ['stretch', 'start'],
  },
  '-error &Label': { fg: 'error' },
  '-error &Input': { border: 'error' },
  Error: { fg: 'error' },
  Label: {
    // flex: 1,
    textAlign: 'left',
    opacity: 0.6,
    fg: 't2',
    w: LABEL_WIDTH,
  },
  Content: {
    row: ['center', 'start'],
    flex: 2,
    hMin: 16,
  },
  Input: {
    w: '100%',
    hMin: FIELD_HEIGHT,
    py: 2,
    px: 8,
    border: 'g2',
    rounded: 5,
    outline: 'none',
    bg: 'b1',
    fg: 't1',
    fontSize: '1rem',
    // elevation: 1,
  },
  'Input:hover': {
    borderColor: 'g3',
  },

  // Régle la couleur de l'autocompletion
  'Input:autofill': {
    '-webkit-text-fill-color': 'black',
    '-webkit-box-shadow': '0 0 0 1000px white inset',
    caretColor: 'black',
  },

  '-check &Input': {
    center: 1,
    p: 0,
    mx: 4,
    whMin: FIELD_HEIGHT,
    whMax: FIELD_HEIGHT,
    cursor: 'pointer',
    border: 'g2',
    bg: 'b1',
    position: 'relative',
    rounded: 3,
    transition: 0.3,
    boxSizing: 'border-box',
  },
  '-check &Input-selected': {
    borderColor: 'p5',
    bg: 'p5',
  },
  '-check &Input svg': {
    fg: 'w1',
    transition: 0.3,
    scale: 0,
  },
  '-check &Input-selected svg': {
    scale: 1,
  },

  '-switch &Input': {
    center: 1,
    w: FIELD_HEIGHT * 2,
    cursor: 'pointer',
    border: 'g2',
    bg: 'b1',
    position: 'relative',
    rounded: 99,
    transition: 0.3,
  },
  '-switch &Input-selected': { borderColor: 'p6', bg: 'p5' },

  '-switch &InputHandle': {
    wh: FIELD_HEIGHT - 4,
    bg: 'w0',
    rounded: 99,
    position: 'absolute',
    elevation: 1,
    transition: 0.3,
    translateX: -(FIELD_HEIGHT - 4) + 'px',
  },
  '-switch &Input-selected &InputHandle': { translateX: FIELD_HEIGHT - 4 + 'px' },
});

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

export interface FieldProps<T = any> extends FieldInfo, DivProps {
  msg?: Flux<T>;
  value?: T;
  cast?: (next: any) => T;
  onValue?: (next: T) => void;
  delay?: number;
  Comp?: FieldComp,
}

export const castByType: Dictionary<(next: any) => any> = {
  json: (next: any) => {
    const casted = jsonParse(next);
    if (casted === null) throw toError('not-a-json');
    return casted;
  },
  number: (next: any) => {
    const casted = toNumber(next, null);
    if (casted === null) throw toError('not-a-number');
    return casted;
  },
  seconds: (next: any) => {
    const seconds = parseSeconds(next);
    if (seconds === null) throw toError('invalid-time-format');
    return seconds;
  },
};

export const formatByType: Dictionary<(value: any) => any> = {
  json: (value: any) => jsonStringify(value, undefined, 2),
  seconds: (value: any) => {
    if (typeof value === 'number') return formatSeconds(value);
    return value || '';
  },
};

const getMediaField = (_mimetypes: string[]): FieldComp => {
  // const mimetypeMap = by(mimetypes, m => m, () => true);
  return ({ cls, name, required, value, onChange, fieldProps }) => {
    // const medias = Object.values(useFlux(medias$));
    // const filteredMedias = medias.filter(m => mimetypeMap[m.mimetype]);
    // const groupId = useFlux(groupId$);
    return (
      <select
        name={name}
        required={required}
        value={value || ''}
        onChange={onChange}
        {...fieldProps.props}
        {...c(cls, fieldProps.props)}
      >
        {/* <option value="" className={!value ? `${cls}Selected` : undefined}></option>
                {Object.values(filteredMedias).map(media => (
                    <option key={media.id} value={media.id} className={media.id === value ? `${cls}Selected` : undefined}>
                        {media.name.replace(`${groupId}/`, '')}
                    </option>
                ))} */}
      </select>
    );
  };
};

const compByType: Record<FieldType, FieldComp> = {
  email: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="email"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  password: ({ cls, name, required, value, onChange, fieldProps }) => {
    const [show, setShow] = useState(false);
    return (
      <>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          required={required}
          value={value || ''}
          onChange={onChange}
          {...fieldProps.props}
          {...c(cls, fieldProps.props)}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            setShow((s) => !s);
          }}
          icon={show ? <EyeOff /> : <Eye />}
        />
      </>
    );
  },
  color: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="color"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  text: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="text"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  multiline: ({ cls, name, required, value, onChange, fieldProps }) => (
    <textarea
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      rows={5}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  json: ({ cls, name, required, value, onChange, fieldProps }) => (
    <textarea
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      rows={5}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  number: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="number"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  // select: ({ name, required, value, onChange, fieldProps }) => (
  //     <select class={cls} name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props}>
  //         {/* <option value=""></option> */}
  //         {fieldProps.items?.map(kv => (
  //             isArray(kv) ? (
  //                 <option key={kv[0]} value={kv[0]} class={kv[0] === value ? `${cls}Selected` : undefined}>
  //                     {kv[1]}
  //                 </option>
  //             ) : null
  //         ))}
  //     </select>
  // ),
  select: ({ fieldProps, ...props }) => (
    <Select {...props} items={fieldProps.items} {...fieldProps.props} />
  ),
  picker: ({ fieldProps, ...props }) => (
    <Picker {...props} items={fieldProps.items} {...fieldProps.props} />
  ),
  switch: ({ cls, value, onChange, fieldProps }) => {
    return (
      <div
        onClick={() => onChange(!value)}
        {...fieldProps.props}
        {...c(cls, value && `${cls}-selected`, fieldProps.props)}
      >
        <div {...c(`${cls}Handle`)}></div>
      </div>
    );
  },
  check: ({ cls, value, onChange, fieldProps }) => {
    return (
      <div
        onClick={() => onChange(!value)}
        {...fieldProps.props}
        {...c(cls, value && `${cls}-selected`, fieldProps.props)}
      >
        <Check />
      </div>
    );
  },
  image: getMediaField(['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']),
  doc: getMediaField(['application/pdf']),
  date: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="date"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  datetime: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="date"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  seconds: ({ cls, name, required, value, onChange, onBlur, fieldProps }) => (
    <input
      type="text"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="00:00:00"
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
};

export const Field = (props: FieldProps) => {
  const {
    col,
    type,
    name,
    label,
    helper,
    error,
    readonly,
    required,
    msg,
    value,
    cast,
    castType,
    onValue,
    delay,
    items,
    Comp,
    children,
    props: propsProps,
    ...divProps
  } = props;
  const valDelay = delay || type === 'switch' || type === 'check' ? 0 : delay;

  const msgVal = useFlux(msg);
  const val = msg ? msgVal : value;

  const handleValue = (casted: any) => {
    if (onValue) onValue(casted);
    if (msg) msg.set(casted);
  };

  const [initiated, setInitiated] = useState<any>(val);
  const [changed, setChanged] = useState<any>(undefined);
  const [sended, setSended] = useState<any>(undefined);
  const [valueError, setValueError] = useState<any>(undefined);

  const err = error ? error : valueError;

  const reset = () => {
    setInitiated(val);
    setChanged(undefined);
    setSended(undefined);
    setValueError(undefined);
  };

  useEffect(reset, [type, name]);

  // if sync value change -> reset
  useEffect(() => {
    if (sended !== undefined) {
      if (sended === val) return;
    } else {
      if (initiated === val) return;
    }
    // console.debug('Field value changed', name, initiated, '->', value);
    reset();
  }, [val]);

  // if next value change -> error or send
  useEffect(() => {
    // console.debug('Field changed', name, changed);
    setValueError(undefined);
    if (changed === undefined) return;
    if (changed === sended) return;
    const timer = setTimeout(
      () => {
        try {
          let casted = changed;
          const castTypeFun = castType && castByType[castType];
          const castFun = type && castByType[type];

          if (castTypeFun) casted = castTypeFun(casted);
          else if (cast) casted = cast(casted);
          else if (castFun) casted = castFun(casted);

          if (casted === sended) return;
          // console.debug('Field sync', name, sended, '->', casted);
          setSended(casted);
          handleValue(casted);
        } catch (error) {
          setValueError(error);
        }
      },
      valDelay === undefined ? 400 : valDelay
    );
    return () => clearTimeout(timer);
  }, [changed]);

  const handleChange = (e: any) => {
    // console.debug('Field handleChange', e);
    if (readonly) return;
    let next = typeof e === 'object' && e.target ? e.target.value : e;
    // console.debug('Field next', name, changed, '->', next);
    setChanged(next);
  };

  const handleBlur = () => {
    // On blur, reset to show the validated/formatted value
    if (changed !== undefined && sended !== undefined) {
      setChanged(undefined);
      setInitiated(sended);
    }
  };

  const FinalComp = Comp || (compByType[type || 'text'] || compByType.text);

  const formatValue = (value: any) => {
    const format = type && formatByType[type];
    return format ? format(value) : value;
  };

  return (
    <div {...divProps} {...c('', col && '-col', type && `-${type}`, err && '-error', divProps)}>
      {label && <div {...c('Label')}>{label} :</div>}
      <div {...c('Content')}>
        <FinalComp
          cls={'Input'}
          name={name}
          value={formatValue(changed === undefined ? initiated : changed)}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          fieldProps={props}
        />
        {children}
        {err ?
          <div {...c('Error')}>
            <Tr>{err}</Tr>
          </div>
        : helper ?
          <div {...c('Helper')}>{helper}</div>
        : null}
      </div>
    </div>
  );
};

export const FieldGroup = (props: DivProps) => <div {...props} {...c('Group', props)} />;
