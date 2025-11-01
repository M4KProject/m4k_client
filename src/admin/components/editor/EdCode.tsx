import { useEffect, useMemo } from 'preact/hooks';
import { B } from './B';
import { exportData, importData } from './bEdit';
import { D } from './D';
import { flux, jsonParse, jsonStringify } from 'fluxio';
import { useFlux } from '@common/hooks';
import { css$, js$, terminal$ } from './flux';
import { Css } from '@common/ui';

const formatHtml = (html: string) => {
  const tab = '\t';
  let result = '';
  let indent = '';

  html = html.replace(/ contenteditable="true"/g, '');
  html = html.replace(/ ?ed-selected/g, '');
  html = html.replace(/&quot;/g, "'");

  html.split(/>\s*</).forEach((el) => {
    if (el.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    result += indent + '<' + el + '>\r\n';

    if (el.match(/^<?\w[^>]*[^/]$/) && !el.startsWith('input')) {
      indent += tab;
    }
  });

  return result.substring(1, result.length - 3);
};

let timer: any;

interface MyCodeMirrorProps {
  value: string;
  type: string;
  onChange?: (newValue: string) => void;
}

const MyCodeMirror = ({ value, type, onChange }: MyCodeMirrorProps) => {
  const text$ = useMemo(() => flux(value), [type]);
  const text = useFlux(text$);

  useEffect(() => onChange && text$.throttle(400).on(onChange), [text$, onChange]);

  return (
    <textarea
      className="MyCodeMirror"
      value={text}
      onChange={(e) => {
        const newText = e.currentTarget?.value;
        console.debug('textarea onChange', newText);
        text$.set(newText);
      }}
    />
  );
};

const EdJsonData = () => {
  const select = useFlux(B.select$) || B.root;
  useFlux(select.update$);

  const data = exportData(select);
  const dataJson = jsonStringify(data) || '{}';

  return (
    <MyCodeMirror
      value={dataJson}
      type="json"
      onChange={(newDataJson) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log('CodeMirror data');
          const newData = jsonParse(newDataJson) as D;
          if (newData) {
            importData(select, newData);
          }
        }, 500);
      }}
    />
  );
};

const EdCodeHtml = () => {
  const select = useFlux(B.select$) || B.root;
  return <MyCodeMirror value={formatHtml(select.el.outerHTML)} type="html" />;
};

const EdCodeCss = () => {
  const val = useFlux(css$);
  return (
    <MyCodeMirror
      value={val}
      type="css"
      onChange={(newVal) => {
        clearTimeout(timer);
        timer = setTimeout(() => css$.set(newVal), 100);
      }}
    />
  );
};

const EdCodeJs = () => {
  const val = useFlux(js$);
  return (
    <MyCodeMirror
      value={val}
      type="javascript"
      onChange={(newVal) => {
        clearTimeout(timer);
        timer = setTimeout(() => js$.set(newVal), 100);
      }}
    />
  );
};

const compMap: Record<string, typeof EdJsonData> = {
  json: EdJsonData,
  html: EdCodeHtml,
  css: EdCodeCss,
  js: EdCodeJs,
};

const c = Css('EdCode', {
  ' .MyCodeMirror': {
    width: '100%',
    height: '100%',
  },
});

export const EdCode = () => {
  const terminal = useFlux(terminal$);
  const Comp = compMap[terminal];
  return <div {...c('', `-${terminal}`)}>{Comp && <Comp />}</div>;
};
