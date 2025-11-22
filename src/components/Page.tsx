import { Css } from 'fluxio';
import { DivProps, Content } from './types';
import { getContent } from './getContent';

const c = Css('Page', {
  '': {
    row: 'stretch',
    flex: 1,
    position: 'relative',
  },
  Body: {
    col: 1,
    flex: 1,
  },
  Container: {
    col: 1,
    overflowY: 'auto',
    bg: 'bg',
    p: 4,
    flex: 1,
  },
  Section: {
    flex: 1,
    col: 1,
    position: 'relative',
    bg: 'bg',
    m: 4,
    rounded: 5,
    elevation: 2,
  },
});

// export interface PageActionsProps extends DivProps {}
// export const PageActions = (props: PageActionsProps) => {
//   return <div {...props} {...c('Actions', props)} />;
// };

export interface PageProps extends DivProps {
  side?: Content;
}

export const Page = ({ side, children, ...props }: PageProps) => (
  <div {...props} {...c('', props)}>
    {getContent(side)}
    <div {...c('Body')}>{children}</div>
  </div>
);

export const PageSection = (props: DivProps) => <div {...props} {...c('Section', props)} />;

export const PageContainer = (props: DivProps) => <div {...props} {...c('Container', props)} />;

export const PageBody = ({ children, ...props }: DivProps) => (
  <PageContainer {...props}>
    <PageSection>{children}</PageSection>
  </PageContainer>
);
