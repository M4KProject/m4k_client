import { getChanges, getStorage, isDeepEqual, isDefined, isFunction, isNotEmpty, isNumber, Listener, logger, NextState, removeItem, toError, toMe, toNumber, Unsubscribe } from 'fluxio';
import { FieldProps, FieldState } from './types';
import { inputRegistry } from './inputRegistry';
import { createContext } from 'preact';

export class FieldController<V, R> {
  private log = logger('FieldController');
  private hash?: string;
  private config: Readonly<FieldProps<V, R>> = {};
  private next?: FieldState<V, R>;
  private timer?: any;
  private readonly listeners: Listener<FieldState<V, R>>[] = [];
  
  public state: FieldState<V, R> = { config: {} };

  subscribe(listener: Listener<FieldState<V, R>>): Unsubscribe {
    this.listeners.push(listener);
    return () => {
      removeItem(this.listeners, listener);
    }
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

    if (!isDeepEqual(this.config.value, props.value)) {
      this.log.d('setProps value', this.config.value, '->', props.value);
      this.config = { ...this.config, value: props.value };
      this.update({ value: props.value });
    }

    if (!isDeepEqual(this.config.error, props.error)) {
      this.log.d('setProps error', this.config.error, '->', props.error);
      this.config = { ...this.config, error: props.error };
      this.update({ error: props.error });
    }
  }

  reset(props: FieldProps<V, R>) {
    const type = props.type || 'text';
    const config = this.config = {
      ...((type ? inputRegistry[type] : null) || inputRegistry.text),
      ...props,
      type,
    };

    this.log = logger(`${config.name}(${type})`);
    this.log.d('reset', this);

    const value = config.stored ? getStorage().get(config.stored, config.value) : config.value;

    let raw: R | undefined = undefined;
    let error = config.error;
    try {
      raw = isDefined(value) ? (config.toRaw||toMe)(value) as any : undefined;
    } catch (e) {
      error = toError(e);
      this.log.e('reset toRaw error', value, error);
    }

    this.state = {
      raw,
      value,
      error,
      config,
    };
    this.next = undefined;
    this.notify();
  }

  update(next?: NextState<Partial<FieldState<V, R>>>) {
    const prev = this.next || this.state;
    this.log.d('update', prev, '->', next);
    const changes = isFunction(next) ? next(prev) : next;
    this.log.d('update changes', changes);
    this.next = { ...prev, ...changes };
    const delay = toNumber(this.config.delay, 400);
    this.log.d('update delay', delay);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.apply(), delay);
  }

  apply() {
    this.log.d('apply');
    const changes = this.next && getChanges(this.state, this.next);
    if (isNotEmpty(changes)) {
      this.log.d('apply changes', changes);

      let { value, raw, event, error } = changes;
      const config = this.config;

      if ('value' in changes) {
        try {
          raw = isDefined(value) ? (config.toRaw||toMe)(value) as any : undefined;
          this.log.d('apply value to raw', value, raw);
        }
        catch (e) {
          error = toError(e);
          this.log.d('apply value to raw error', value, error);

        }
      } else if ('raw' in changes) {
        try {
          value = isDefined(raw) ? (config.toValue||toMe)(raw, event) as any : undefined;

          if (isNumber(value)) {
            const { min, max } = config;
            if (isNumber(min) && value < min) value = min;
            else if (isNumber(max) && value > max) value = max;
          }

          this.log.d('apply raw to value', raw, value);
        }
        catch (e) {
          error = toError(e);
          this.log.d('apply raw to value error', raw, error);
        }
      }

      this.state = { ...this.state, ...changes, value, raw, error };
      this.next = undefined;
      this.notify();
    }
  }

  notify() {
    const state = this.state;
    this.log.d('notify', state);
    const value = state.value;

    if (isDefined(value)) {
      this.config.onValue?.(value);
    }

    for (const listener of this.listeners) {
      try {
        listener(state);
      }
      catch (error) {
        this.log.e('notify error', this, listener, error);
      }
    }
  }

  onChange(event: any) {
    this.log.d('onChange', event);
    if (this.config.readonly) return;

    const raw = event instanceof Event ? (event.target as any).value : event;
    this.log.d('onChange raw', event, raw);

    this.update({ raw, event });
  }

  // clear() {
  //   this.log.d('clear');
  //   this.parsed$.set(undefined);
  // }
}

export const FieldContext = createContext<FieldController<any, any> | undefined>(undefined);

export const FieldProvider = FieldContext.Provider;
