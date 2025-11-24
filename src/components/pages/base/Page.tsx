import { Css, flux, isBoolean } from 'fluxio';
import { comp, Comp } from '@/utils/comp';
import { DivProps } from '@/components/common/types';
import { Toolbar } from './Toolbar';
import { useConstant } from '@/hooks/useConstant';
import { Menu } from './Menu';

const c = Css('Page', {
  '': {
    wh: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    col: ['stretch', 'start'],
    position: 'relative',
  },
  Body: {
    row: ['stretch', 'start'],
    flex: 1,
  },
  Content: {
    col: 1,
    flex: 1,
    p: 8,
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
  title: string;
  menu?: Comp;
}

export const Page = ({ title, menu, children, ...props }: PageProps) => {
  const openMenu$ = useConstant(() => flux(true));

  return (
    <div {...props} {...c('')}>
      <Toolbar title={title} openMenu$={openMenu$} />
      <div {...c('Body')}>
        <Menu openMenu$={openMenu$} menu={menu} />
        <div {...c('Content', props)}>{children}</div>
      </div>
    </div>
  );
};

// export const PageSection = (props: DivProps) => <div {...props} {...c('Section', props)} />;

// export const PageContainer = (props: DivProps) => <div {...props} {...c('Container', props)} />;

// export const PageBody = ({ children, ...props }: DivProps) => (
//   <PageContainer {...props}>
//     <PageSection>{children}</PageSection>
//   </PageContainer>
// );
