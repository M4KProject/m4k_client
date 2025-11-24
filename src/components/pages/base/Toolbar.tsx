import { Css, Flux } from 'fluxio';
import { comp, Comp } from '@/utils/comp';
import { DivProps } from '@/components/common/types';
import { Button } from '@/components/common/Button';
import { UserIcon, MenuIcon } from 'lucide-react';
import { useRouteController } from '@/hooks/useRouteController';

const c = Css('Toolbar', {
    '': {
        h: 32,
        w: '100%',
    },
  Fixed: {
    position: 'fixed',
    w: '100%',
    h: 32,
    bg: 'toolbarBg',
    fg: 'toolbarFg',
    elevation: 2,
    row: 1,
    zIndex: 20,
  },
  ' .Button': {
    m: 0,
    border: 0,
    fg: 'toolbarFg',
  },
  Title: {
    flex: 1,
    bold: 1,
  },
  Sep: {
    flex: 1
  },
  Version: {
    color: 'p',
    bold: 1,
    borderBottom: 1,
    borderColor: 'p',
    opacity: 0.3,
    fontSize: '12px',
    center: 1,
  },
});

// export interface PageActionsProps extends DivProps {}
// export const PageActions = (props: PageActionsProps) => {
//   return <div {...props} {...c('Actions', props)} />;
// };

export interface PageProps extends DivProps {
  title: string;
  side?: Comp;
}

export const Toolbar = ({ title, openMenu$ }: { title: string, openMenu$: Flux<boolean> }) => {
  const routeController = useRouteController();
  return (
    <div {...c('')}>
        <div {...c('Fixed')}>
            <Button
                icon={MenuIcon}
                onClick={() => openMenu$.set(prev => !prev)}
            />
            <div {...c('Sep')} />
            <div {...c('Title')}>
                {comp(title)}
            </div>
            <div {...c('Sep')} />
            <div {...c('Version')}>2.2</div>
            <Button
                icon={UserIcon}
                // selected={page === 'account'}
                // onClick={go('account')}
            />
        </div>
    </div>
  )
}