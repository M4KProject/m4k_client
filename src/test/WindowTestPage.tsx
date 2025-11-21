import { Css } from 'fluxio';
import { Button } from '@/components/Button';
import { showWindow } from '@/components/Window';
import { refreshTheme, updateTheme } from '@/utils/theme';

const c = Css('WindowTestPage', {
  '': {
    col: 1,
    p: 20,
    gap: 20,
    maxWidth: 600,
    margin: '0 auto',
    bg: 'bg',
    fg: 't',
  },
  Title: {
    fontSize: 2,
    bold: 1,
    mb: 20,
  },
  Section: {
    col: 1,
    gap: 10,
    p: 15,
    rounded: 8,
    bg: 'bg2',
  },
  SectionTitle: {
    fontSize: 1.2,
    bold: 1,
    mb: 10,
  },
  Buttons: {
    row: 1,
    gap: 10,
    flexWrap: 'wrap',
  },
});

updateTheme({
  isDark: false,
  isUserDark: false,
  primary: '#28A8D9',
  secondary: undefined,
  grey: undefined,
});
refreshTheme();

const TestContent = ({ text }: { text: string }) => (
  <div style={{ padding: '20px' }}>
    <h3>Window Content</h3>
    <p>{text}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
);

export const WindowTestPage = () => {
  const openBasic = () => {
    showWindow('Basic Window', <TestContent text="This is a basic window" />);
  };

  const openDraggable = () => {
    showWindow('Draggable Window', <TestContent text="Drag me by the header!" />, {
      draggable: true,
    });
  };

  const openResizable = () => {
    showWindow('Resizable Window', <TestContent text="Resize me from any edge or corner!" />, {
      resizable: true,
    });
  };

  const openBoth = () => {
    showWindow('Draggable & Resizable', <TestContent text="Full featured window!" />, {
      draggable: true,
      resizable: true,
    });
  };

  const openCustomSize = () => {
    showWindow('Custom Size', <TestContent text="Custom dimensions" />, {
      w: 600,
      h: 400,
      min: [300, 200],
      max: [800, 600],
      draggable: true,
      resizable: true,
    });
  };

  const openWithController = () => {
    const result = showWindow(
      'With Controller',
      <div style={{ padding: '20px' }}>
        <p>Window with controller access</p>
        <Button onClick={() => result.close()}>Close from inside</Button>
      </div>,
      {
        draggable: true,
        resizable: true,
      }
    );

    console.log('Window controller:', result.ctrl);
    console.log('Initial size:', result.ctrl.size$.get());
    console.log('Initial pos:', result.ctrl.pos$.get());
  };

  return (
    <div {...c()}>
      <div {...c('Title')}>Test Window Component</div>

      <div {...c('Section')}>
        <div {...c('SectionTitle')}>Basic Windows</div>
        <div {...c('Buttons')}>
          <Button onClick={openBasic}>Basic</Button>
          <Button onClick={openDraggable}>Draggable</Button>
          <Button onClick={openResizable}>Resizable</Button>
          <Button onClick={openBoth}>Both</Button>
        </div>
      </div>

      <div {...c('Section')}>
        <div {...c('SectionTitle')}>Advanced</div>
        <div {...c('Buttons')}>
          <Button onClick={openCustomSize}>Custom Size</Button>
          <Button onClick={openWithController}>With Controller</Button>
        </div>
      </div>
    </div>
  );
};
