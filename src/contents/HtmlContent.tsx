import { useCss } from '@common/hooks';
import { Css } from '@common/helpers';
import { Div } from '@common/components';
import { ContentProps } from './ContentViewer';

const css: Css = {
  '&': {
    minHeight: '100vh',
    overflow: 'auto',
  },
  '&Container': {
    w: '100%',
    h: '100%',
  }
};

export const HtmlContent = ({ content, data }: ContentProps) => {
  const c = useCss('HtmlContent', css);
  
  const htmlContent = data.html || '<p>Aucun contenu HTML défini</p>';
  
  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}Container`} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </Div>
  );
};