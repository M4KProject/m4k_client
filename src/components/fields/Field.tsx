import { jsonParse, jsonStringify } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';
import { toNumber } from 'fluxio';
import { DivProps } from '@/components/types';
import { Tr } from '@/components/Tr';
import { toError } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { Dictionary } from 'fluxio';
import { formatSeconds, parseSeconds } from 'fluxio';
import { FieldProps } from './types';
import { fieldStyle } from './fieldStyle';
import { fieldRegistry } from './fieldRegistry';

const c = fieldStyle;

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
  json: (value: any) => {
    if (typeof value === 'string') return value;
    return jsonStringify(value, undefined, 2);
  },
  seconds: (value: any) => {
    if (typeof value === 'number') return formatSeconds(value);
    return value || '';
  },
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

  const FinalComp = Comp || (fieldRegistry[type || 'text'] || fieldRegistry.text);

  const formatValue = (value: any) => {
    const format = type && formatByType[type];
    return format ? format(value) : value;
  };

  const isContainer = children && !Comp && !type;

  return (
    <div {...divProps} {...c('', col && '-col', type && `-${type}`, err && '-error', divProps)}>
      {label && <div {...c('Label')}>{label} :</div>}
      <div {...c('Content')}>
        {isContainer ? (
          children
        ) : (
          <>
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
          </>
        )}
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
