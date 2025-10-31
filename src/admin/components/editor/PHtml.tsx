import { PProps } from './interfaces';
import ReactQuill from 'react-quill';
import B from '../../../site/B';
import { getColors } from '../../../helpers/bEdit';
import useConstant from '../../hooks/useConstant';
import Box from '@mui/material/Box';
import { useEffect, useMemo, useRef } from 'react';
import app from '../../../app';

// function PHtmlToolbar({ id }: { id: string }) {
//     return (
//         <div id={id}>
//             <select className="ql-color">
//                 <option value="red"></option>
//                 <option value="green"></option>
//                 <option value="blue"></option>
//                 {B.root.getColors().map(color => (
//                     <option key={color} value={color}></option>
//                 ))}
//             </select>
//             <button className="ql-bold"></button>
//             <button className="ql-italic"></button>
//             <button className="ql-underline"></button>
//             <button className="ql-strike"></button>
//             <button className="ql-clean"></button>
//         </div>
//     )
// };
// [
//     ['bold', 'italic', 'underline', 'strike', 'color'],
//     [{  }],
//     ['clean'],
// ]

function newTagName(oldEl: HTMLElement, newTagName: string): HTMLElement {
  const newEl = document.createElement(newTagName);
  while (oldEl.firstChild) {
    newEl.appendChild(oldEl.firstChild);
  }
  Array.from(oldEl.attributes).forEach((attr) => {
    newEl.attributes.setNamedItem(attr.cloneNode() as Attr);
  });
  oldEl.parentNode?.replaceChild(newEl, oldEl);
  return newEl;
}

function cleanNode(node: ChildNode) {
  node.childNodes.forEach(cleanNode);
  if (node instanceof HTMLElement) {
    let el = node;
    const tagName = el.tagName;
    if (tagName === 'EM') el = newTagName(el, 'I');
    if (tagName === 'STRONG') el = newTagName(el, 'B');
  }
}

function cleanHtml(text: string) {
  console.debug('cleanHtml', text);
  const ctnEl = document.createElement('div');
  ctnEl.innerHTML = String(text);
  const nodes = ctnEl.childNodes;
  nodes.forEach(cleanNode);
  if (nodes.length === 0) return '';
  if (nodes.length === 1) return (nodes[0] as HTMLElement).innerHTML || '';
  return ctnEl.innerHTML.replace(/<div><\/div>/g, '');
}

app.cleanHtml = cleanHtml;
app.cleanNode = cleanNode;

export default function PHtml({ v, setV, b, setText, text }: PProps) {
  const toolbarContainerRef = useRef<HTMLDivElement>(null);
  const info = useConstant<{ b?: B }>(() => ({}));
  // v = (v && !String(v).startsWith('<p>')) ? '<p>' + v + '</p>' : v;

  const toolbarEl = useMemo(() => {
    const el = document.createElement('div');
    el.id = 'PHtml_' + b?._id;
    const colorEl = document.createElement('select');
    colorEl.className = 'ql-color';
    el.appendChild(colorEl);
    ['white', 'black', 'red', 'green', 'blue', ...getColors(B.root)].forEach((color) => {
      const opt = document.createElement('option');
      opt.value = color;
      colorEl.appendChild(opt);
    });
    ['ql-bold', 'ql-italic', 'ql-underline', 'ql-strike', 'ql-clean'].forEach((cls) => {
      const btn = document.createElement('button');
      btn.className = cls;
      el.appendChild(btn);
    });
    return el;
  }, []);

  // console.debug('PHtml', toolbarEl.id, toolbarEl, toolbarContainerRef);

  useEffect(() => {
    // console.debug('PHtml useEffect', toolbarEl.id, toolbarEl, toolbarContainerRef);
    if (toolbarContainerRef.current) {
      toolbarContainerRef.current.appendChild(toolbarEl);
    }
  }, [toolbarContainerRef]);

  // const toolbarContainerEl = toolbarContainerRef.current;
  // useEffect(() => {
  //     if (toolbarContainerEl) {
  //         toolbarContainerEl.innerHTML = '';
  //         toolbarContainerEl.appendChild(toolbarEl);
  //     }
  // }, [toolbarContainerEl]);

  return (
    <Box
      key={b?._id}
      className="PInput"
      sx={{
        '& .quill .ql-toolbar': {
          borderRadius: '4px 4px 0 0',
        },
        '& .quill .ql-container': {
          borderRadius: '0 0 4px 4px',
        },
      }}
    >
      {/* <PHtmlToolbar id={toolbarId} /> */}
      <div className="PHtmlToolbarContainer" ref={toolbarContainerRef} />
      <ReactQuill
        theme="snow"
        value={text}
        modules={{
          toolbar: {
            container: toolbarEl, // '#' + toolbarEl.id,
          },
        }}
        onFocus={() => {
          console.debug('PHtml onFocus');
          info.b = b;
        }}
        onChange={(v) => {
          // console.debug('PHtml onChange', v);
          if (info.b !== b) return;
          // if (v.split('<p>').length === 2) {
          //     v = v.substring(3, v.length-4);
          // }
          setText(v);
          setV(cleanHtml(v));
        }}
      />
    </Box>
  );
}
