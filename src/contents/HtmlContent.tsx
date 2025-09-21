
import { Css } from '@common/ui';
import { Div } from '@common/components';
import type { ContentProps } from './ContentViewer';
import { HtmlContentModel } from '@common/api';

const css = Css('HtmlContent', {
  '&': {
    minHeight: '100vh',
    overflow: 'auto',
  },
  '&Container': {
    w: '100%',
    h: '100%',
  },
});

export const HtmlContent = ({ content }: ContentProps<HtmlContentModel>) => {
  const htmlContent = content.data.html || '<p>Aucun contenu HTML défini</p>';

  return <Div  cls={css()} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};
