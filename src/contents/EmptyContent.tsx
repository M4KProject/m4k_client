import { useCss } from '@common/hooks';
import { Css, flexColumn } from '@common/helpers';
import { Div } from '@common/components';
import { ContentProps } from './ContentViewer';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    minHeight: '100vh',
    p: 2,
  },
  '&Message': {
    fontSize: 1.5,
    color: '#666',
    textAlign: 'center',
  }
};

export const EmptyContent = ({ content }: ContentProps) => {
  const c = useCss('EmptyContent', css);
  
  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}Message`}>
        <h2>{content.title || 'Contenu vide'}</h2>
        <p>Ce contenu n'a pas encore été configuré.</p>
      </Div>
    </Div>
  );
};