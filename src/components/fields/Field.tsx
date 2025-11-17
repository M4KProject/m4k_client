import { isNotEmpty } from 'fluxio';
import { useEffect, useMemo } from 'preact/hooks';
import { DivProps } from '@/components/types';
import { Tr } from '@/components/Tr';
import { useFlux } from '@/hooks/useFlux';
import { FieldProps, FieldComponent } from './types';
import { fieldStyle } from './fieldStyle';
import { FieldCtrl, FieldProvider } from './FieldCtrl';

const c = fieldStyle;

export const Field: FieldComponent = (props: FieldProps) => {
  const ctx = useMemo(() => new FieldCtrl(), []);
  useEffect(() => {
    () => ctx.dispose();
  }, [ctx]);

  ctx.setProps(props);

  const config = ctx.config;
  const { input: Input, children, label, helper, col, type, containerProps } = config;

  const error = useFlux(ctx.error$);

  const isComposed = isNotEmpty(children);

  return (
    <FieldProvider value={ctx}>
      <div
        {...containerProps}
        {...c('', col && '-col', type && `-${type}`, error && '-error', containerProps)}
      >
        {label && <div {...c('Label')}>{label} :</div>}
        <div {...c('Content')}>
          {isComposed ?
            children
          : Input ?
            <Input />
          : null}
          {error ?
            <div {...c('Error')}>
              <Tr>{error}</Tr>
            </div>
          : helper ?
            <div {...c('Helper')}>{helper}</div>
          : null}
        </div>
      </div>
    </FieldProvider>
  );
};

export const FieldGroup = (props: DivProps) => <div {...props} {...c('Group', props)} />;
