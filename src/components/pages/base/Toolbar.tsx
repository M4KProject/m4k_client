import { Css, Flux } from 'fluxio';
import { comp, Comp } from '@/utils/comp';
import { DivProps } from '@/components/common/types';
import { Button } from '@/components/common/Button';
import { UserIcon, MenuIcon } from 'lucide-react';
import { useRouteController } from '@/hooks/useRouteController';

const c = Css('Toolbar', {
    '': {
        h: 34,
        w: '100%',
    },
  Fixed: {
    position: 'fixed',
    xy: 0,
    w: '100%',
    h: 34,
    bg: 'barBg',
    fg: 'barFg',
    elevation: 3,
    row: ['center', 'center'],
    zIndex: 20,
  },
  ' .Button': {
    m: 0,
    border: 0,
    fg: 'barFg',
  },
  Title: {
    bold: 1,
  },
  Sep: {
    flex: 1
  },
  Version: {
    opacity: 0.3,
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
            <div {...c('Version')}>2.3</div>
            <Button
                icon={UserIcon}
                onClick={() => routeController.go({ page: 'dashboard' })}
            />
        </div>
    </div>
  )
}