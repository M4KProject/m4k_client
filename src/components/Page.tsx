import { Css } from 'fluxio';
import { DivProps } from './types';

const c = Css('Page', {
  '': {
    col: 1,
    flex: 1,
    position: 'relative',
  },
  Container: {
    col: 1,
    overflowY: 'auto',
    bg: 'b2',
    p: 4,
    flex: 1,
  },
  Section: {
    flex: 1,
    col: 1,
    position: 'relative',
    bg: 'b0',
    m: 4,
    rounded: 5,
    elevation: 2,
  },
});

// export interface PageActionsProps extends DivProps {}
// export const PageActions = (props: PageActionsProps) => {
//   return <div {...props} {...c('Actions', props)} />;
// };

export const Page = (props: DivProps) => <div {...props} {...c('', props)} />;

export const PageSection = (props: DivProps) => <div {...props} {...c('Section', props)} />;

export const PageContainer = (props: DivProps) => <div {...props} {...c('Container', props)} />;

export const PageBody = ({ children, ...props }: DivProps) => (
  <PageContainer {...props}>
    <PageSection>{children}</PageSection>
  </PageContainer>
);
