import { flux, fluxStored, isNumber, logger, toMe, Unsubscribe } from 'fluxio';
import { FieldProps, FieldType } from './types';
import { inputRegistry } from './inputRegistry';
import { createContext } from 'preact';

export class FieldController<T = any> {
  log = logger('FieldController');
  props: Readonly<FieldProps<T>> = { type: ({} as any) };
  offs: Unsubscribe[] = [];
  type: FieldType = 'text';
  config: Readonly<FieldProps<T>> = {};
  input$ = flux<any>(undefined);
  value$ = flux<any>(undefined);
  error$ = flux<any>(undefined);

  constructor() {
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.convert = this.convert.bind(this);
    this.reverse = this.reverse.bind(this);
  }

  onChange(e: any) {
    this.log.d('onChange', e);

    if (this.config.readonly) return;

    const input = e instanceof Event ? (e.target as any).value : e;
    this.log.d('onChange input', e, input);

    this.input$.set(input);
  }

  onBlur(e: any) {
    this.onChange(e);
  }

  clear() {
    this.log.d('clear');
    this.value$.set(undefined);
  }

  dispose() {
    for (const off of this.offs) off();
    this.offs = [];
  }

  setProps(props: FieldProps<T>) {
    const last = this.props;

    if (last.type !== props.type || last.name !== props.name || last.delay !== props.delay) {
      this.props = props;
      this.reset();
    }

    if (last.value !== props.value) {
      this.value$.set(props.value);
    }

    if (last.error !== props.error) {
      this.error$.set(props.error);
    }
  }

  convert(input: any) {
    try {
      this.log.d('convert', input);

      const { convert, min, max, onValue } = this.config;
      let value = convert ? convert(input) : input;

      if (isNumber(min) && value < min) value = min;
      if (isNumber(max) && value > max) value = max;

      if (onValue) {
        setTimeout(() => onValue(value), 0);
      }

      this.log.d('convert value', input, '->', value);
      this.error$.set(undefined);
      return value;
    }
    catch (error) {
      this.log.w('convert error', input, error);
      this.error$.set(error);
    }
  }

  reverse(value: any) {
    try {
      this.log.d('reverse', value);
      this.error$.set(undefined);

      const { reverse } = this.config;
      let input = reverse ? reverse(value) : value;

      this.log.d('reverse value', value, '->', input);
      return value;
    }
    catch (error) {
      this.log.w('convert error', value, error);
      this.error$.set(error);
    }
  }

  reset() {
    this.log.d('reset', this);

    this.dispose();

    this.input$.set(undefined);
    this.error$.set(undefined);

    const type = this.props.type || 'text';
    this.type = type;

    const typeConfig = (type ? inputRegistry[type] : null) || inputRegistry.text;

    const config = {
      ...typeConfig,
      ...this.props,
      type,
    };

    this.log = logger(`${config.name}(${type})`);

    this.config = config;

    const { delay, stored } = config;

    this.value$ = this.input$
      .debounce(delay||400)
      .map(this.convert, this.reverse);

    if (stored) {
      this.value$ = fluxStored(stored, this.value$);
    }
  }
}

export const FieldContext = createContext<FieldController | undefined>(undefined);

export const FieldProvider = FieldContext.Provider;
