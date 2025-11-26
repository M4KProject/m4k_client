import { Css, Flux } from 'fluxio';
import { DivProps } from '@/components/common/types';
import { Button } from '@/components/common/Button';
import { UserIcon, MenuIcon } from 'lucide-react';
import { useRouter } from '@/hooks/useRoute';
import { useGroup } from '@/hooks/useApi';

const c = Css('Toolbar', {
  '': {
    hMin: 34,
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
    flex: 1,
  },
  Version: {
    opacity: 0.3,
  },
});

export interface ToolbarProps extends DivProps {
  openMenu$: Flux<boolean>
}

export const Toolbar = ({ openMenu$ }: ToolbarProps) => {
  const routeController = useRouter();
  const group = useGroup();
  return (
    <div {...c('')}>
      <div {...c('Fixed')}>
        <Button icon={MenuIcon} onClick={() => openMenu$.set((prev) => !prev)} />
        <div {...c('Sep')} />
        <div {...c('Title')}>{group?.name}</div>
        <div {...c('Sep')} />
        <div {...c('Version')}>2.3</div>
        <Button icon={UserIcon} onClick={() => routeController.go({ page: 'dashboard' })} />
      </div>
    </div>
  );
};
