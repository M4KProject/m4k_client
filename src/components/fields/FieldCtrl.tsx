import { flux, fluxStored, isNumber, logger, Unsubscribe } from 'fluxio';
import { FieldProps, FieldType } from './types';
import { defaultInputConfig, fieldRegistry } from './fieldRegistry';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { useFlux } from '@/hooks/useFlux';

export class FieldCtrl<T = any> {
  log = logger('FieldContext');
  props: Readonly<FieldProps<T>> = {};
  offs: Unsubscribe[] = [];
  type: FieldType = 'text';
  config: Readonly<FieldProps<T>> = {};
  input$ = flux<any>(undefined);
  value$ = flux<any>(undefined);
  error$ = flux<any>(undefined);

  constructor() {
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  dispose() {
    for (const off of this.offs) off();
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

  reset() {
    this.dispose();

    this.input$.set(undefined);
    this.error$.set(undefined);

    const type = this.props.type || 'text';
    this.type = type;

    const config = {
      ...defaultInputConfig,
      ...((type ? fieldRegistry[type] : null) || fieldRegistry.text),
      ...this.props,
      type,
    };

    this.log = logger(`${config.name}(${type})`);

    this.config = config;

    const { delay, convert, reverse, stored, onValue, min, max } = config;

    let value$ = this.input$;
    if (delay) value$ = value$.debounce(delay);
    if (convert) value$ = value$.map(convert, reverse);
    if (stored) value$ = fluxStored(stored, value$);
    this.value$ = value$;

    this.offs = [
      this.input$.on(
        (input) => {
          this.log.d('input', this, input);
          this.error$.set(undefined);
        },
        (error) => {
          this.log.w('input error', this, this.input$.get(), error);
          this.error$.set(error);
        }
      ),
      this.value$.on(
        (value) => {
          this.log.d('value', this, value);
          this.error$.set(undefined);

          if (isNumber(min) && value < min) this.value$.set(min);
          if (isNumber(max) && value > max) this.value$.set(max);

          if (onValue) onValue(value);
        },
        (error) => {
          this.log.w('value error', this, this.value$.get(), error);
          this.error$.set(error);
        }
      ),
    ];
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
}

export const FieldContext = createContext<FieldCtrl | undefined>(undefined);

export const FieldProvider = FieldContext.Provider;

export const useFieldContext = () => useContext(FieldContext)!;

export const useInputProps = (): any => {
  const ctx = useContext(FieldContext)!;
  const value = useFlux(ctx.input$);
  const { onChange, onBlur, config } = ctx;
  const { props: inputProps, name, required, placeholder } = config;
  const props: any = { value, onChange, onBlur, name, required, ...inputProps };
  if (placeholder) props.placeholder = placeholder;
  return props;
};

// value={formatValue(changed === undefined ? initiated : changed)}
