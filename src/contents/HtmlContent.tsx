import { useCss } from '@common/hooks';
import { Css } from '@common/helpers';
import { Div } from '@common/components';
import type { ContentProps } from './ContentViewer';
import { HtmlContentModel } from '@common/api';

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

export const HtmlContent = ({ content }: ContentProps<HtmlContentModel>) => {
  const c = useCss('HtmlContent', css);
  
  const htmlContent = content.data.html || '<p>Aucun contenu HTML défini</p>';
  
  return (
    <Div cls={`${c}`} dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};