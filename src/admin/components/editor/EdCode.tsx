// import CodeMirror from '@uiw/react-codemirror';
// import { EditorView, basicSetup } from "codemirror"
// import { json } from '@codemirror/lang-json';
// import { html } from '@codemirror/lang-html';
// import { css } from '@codemirror/lang-css';
// import { javascript } from '@codemirror/lang-javascript';
import { Msg, useMsg } from 'vegi';
import { editorCtrl } from '../../controllers/EditorController';
import B from '../../../site/B';
import { exportData, importData } from '../../../helpers/bEdit';
import Box from '@mui/material/Box';
import { getJson, parseJson } from 'vegi';
import { D } from '../../../site/D';
import { useEffect, useMemo } from 'react';

function formatHtml(html: string) {
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

    if (el.match(/^<?\w[^>]*[^\/]$/) && !el.startsWith('input')) {
      indent += tab;
    }
  });

  return result.substring(1, result.length - 3);
}

let timer: any;

interface MyCodeMirrorProps {
  value: string;
  type: string;
  onChange?: (newValue: string) => void;
}

function MyCodeMirror({ value, type, onChange }: MyCodeMirrorProps) {
  const text$ = useMemo(() => new Msg(value), [type]);
  const text = useMsg(text$);

  useEffect(() => onChange && text$.throttle(400).on(onChange), [text$, onChange]);

  return (
    <textarea
      className="MyCodeMirror"
      value={text}
      onChange={(e) => {
        const newText = e.target.value;
        console.debug('textarea onChange', newText);
        text$.set(newText);
      }}
    />
  );
}

function EdJsonData() {
  const select = useMsg(B.select$) || B.root;
  useMsg(select.update$);

  const data = exportData(select);
  const dataJson = getJson(data, '{}', true);

  return (
    <MyCodeMirror
      value={dataJson}
      type="json"
      onChange={(newDataJson) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log('CodeMirror data');
          const newData = parseJson<D>(newDataJson);
          if (newData) {
            importData(select, newData);
          }
        }, 500);
      }}
    />
  );
}

function EdCodeHtml() {
  const select = useMsg(B.select$) || B.root;
  return (
    <MyCodeMirror
      value={formatHtml(select.el.outerHTML)}
      type="html"
    />
  );
}

function EdCodeCss() {
  const val = useMsg(editorCtrl.css$);
  return (
    <MyCodeMirror
      value={val}
      type="css"
      onChange={(newVal) => {
        clearTimeout(timer);
        timer = setTimeout(() => editorCtrl.css$.set(newVal), 100);
      }}
    />
  );
}

function EdCodeJs() {
  const val = useMsg(editorCtrl.js$);
  return (
    <MyCodeMirror
      value={val}
      type="javascript"
      onChange={(newVal) => {
        clearTimeout(timer);
        timer = setTimeout(() => editorCtrl.js$.set(newVal), 100);
      }}
    />
  );
}

const compMap: Record<string, () => JSX.Element> = {
  json: EdJsonData,
  html: EdCodeHtml,
  css: EdCodeCss,
  js: EdCodeJs,
};

export default function EdCode() {
  const terminal = useMsg(editorCtrl.terminal$);
  const Comp = compMap[terminal];
  return (
    <Box
      className={`EdCode EdCode-${terminal}`}
      sx={{
        '& .MyCodeMirror': {
          width: '100%',
          height: '100%',
        },
      }}
    >
      {Comp && <Comp />}
    </Box>
  );
}
