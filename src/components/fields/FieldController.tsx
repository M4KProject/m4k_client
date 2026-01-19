import {
  getChanges,
  getStorage,
  isDeepEqual,
  isDefined,
  isFunction,
  isNotEmpty,
  isNumber,
  Listener,
  logger,
  NextState,
  removeItem,
  toError,
  toMe,
  toNumber,
  Unsubscribe,
} from 'fluxio';
import { FieldProps, FieldState } from './types';
import { inputRegistry } from './inputRegistry';
import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';

export class FieldController<V, R> {
  private log = logger('FieldController');
  private hash?: string;
  private config: Readonly<FieldProps<V, R>> = {};
  private propsValue?: V;
  private propsError?: ComponentChildren;
  private next?: FieldState<V, R>;
  private timer?: any;
  private readonly listeners: Listener<FieldState<V, R>>[] = [];

  public state: FieldState<V, R> = { config: {} };
  initValue: any;

  subscribe(listener: Listener<FieldState<V, R>>): Unsubscribe {
    this.log.d('subscribe');
    this.listeners.push(listener);
    return () => {
      removeItem(this.listeners, listener);
    };
  }

  setProps(props: FieldProps<V, R>) {
    this.log.d('setProps', props);
    const { value, error, ...rest } = props;

    const hash = Object.values(rest).join(';');
    if (this.hash !== hash) {
      this.hash = hash;
      this.reset(props);
      return;
    }

    if (this.propsValue === props.value || isDeepEqual(this.propsValue, props.value)) {
      // No change, skip
    } else {
      this.propsValue = props.value;
      this.update({ value: props.value });
    }

    if (this.propsError === props.error || isDeepEqual(this.propsError, props.error)) {
      // No change, skip
    } else {
      this.propsError = props.error;
      this.update({ error: props.error });
    }
  }

  reset(props: FieldProps<V, R>) {
    const type = props.type || 'text';
    const config = (this.config = {
      ...((type ? inputRegistry[type] : null) || inputRegistry.text),
      ...props,
      type,
    });

    this.log = logger(`Field:${config.name || type}`);
    this.log.d('reset', type, config, props);

    const value = config.stored ? getStorage().get(config.stored, config.value) : config.value;
    this.propsValue = props.value;
    this.propsError = props.error;

    let raw: R | undefined = undefined;
    let error = config.error;
    try {
      raw = isDefined(value) ? ((config.toRaw || toMe)(value) as any) : undefined;
    } catch (e) {
      error = toError(e);
      this.log.e('toRaw error', value, error);
    }

    this.initValue = value;
    this.state = { raw, value, error, config };
    this.next = undefined;
    // this.notify();
  }

  update(next?: NextState<Partial<FieldState<V, R>>>) {
    this.log.d('update', next);
    const prev = this.next || this.state;
    const changes = isFunction(next) ? next(prev) : next;
    this.next = { ...prev, ...changes };
    const delay = toNumber(this.config.delay, 400);

    if (this.timer) clearTimeout(this.timer);

    if (delay === 0) {
      this.apply();
    } else {
      this.timer = setTimeout(() => this.apply(), delay);
    }
  }

  apply() {
    this.log.d('apply');
    const changes = this.next && getChanges(this.state, this.next);
    if (isNotEmpty(changes)) {
      let { value, raw, event, error } = changes;
      const config = this.config;

      if ('value' in changes) {
        try {
          raw = isDefined(value) ? ((config.toRaw || toMe)(value) as any) : undefined;
        } catch (e) {
          error = toError(e);
          this.log.e('toRaw error', value, error);
        }
      } else if ('raw' in changes) {
        try {
          value = isDefined(raw) ? ((config.toValue || toMe)(raw, event) as any) : undefined;

          if (isNumber(value)) {
            const { min, max } = config;
            if (isNumber(min) && value < min) value = min;
            else if (isNumber(max) && value > max) value = max;
          }
        } catch (e) {
          error = toError(e);
          this.log.e('toValue error', raw, error);
        }
      }

      this.state = { ...this.state, ...changes, value, raw, error };
      this.next = undefined;
      this.notify();
    }
  }

  notify() {
    this.log.d('notify');
    const state = this.state;
    const value = state.value;
    const onValue = this.config.onValue;

    if (isDefined(value) && onValue) {
      console.debug('///// onValue /////', value);
      onValue(value);
    }

    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (error) {
        this.log.e('listener error', error);
      }
    }
  }

  private _onChange(event: any) {
    this.log.d('_onChange', event);
    if (this.config.readonly) return;
    const raw = event instanceof Event ? (event.target as any).value : event;
    this.update({ raw, event });
  }
  onChange = this._onChange.bind(this);
}

export const FieldContext = createContext<FieldController<any, any> | undefined>(undefined);

export const FieldProvider = FieldContext.Provider;
