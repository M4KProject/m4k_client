import { Css, flux } from 'fluxio';
import { Comp } from '@/utils/comp';
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
  Scroll: {
    position: 'relative',
    flex: 1,
  },
  Content: {
    position: 'absolute',
    overflowX: 'hidden',
    overflowY: 'auto',
    wh: '100%',
    rowWrap: 1,
    alignItems: 'stretch',
    flex: 1,
    bg: 'body',
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
  menu?: Comp;
}

export const Page = ({ menu, children, ...props }: PageProps) => {
  const openMenu$ = useConstant(() => flux(true));

  return (
    <div {...props} {...c('')}>
      {menu && (
        <Toolbar openMenu$={openMenu$} />
      )}
      <div {...c('Body')}>
        {menu && (
          <Menu openMenu$={openMenu$} menu={menu} />
        )}
        <div {...c('Scroll')}>
          <div {...c('Content', props)}>{children}</div>
        </div>
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
