// import { useEffect, useRef, useState } from 'react';
// import { autoScrollEnd, Css, flexRow, stringify } from '@common/helpers';
// import { Button, Div } from '@common/components';
// import { m4k, M4kLog } from '@common/m4k';
// import { useCss } from '@common/hooks';

// const showValue = (value: any) => {
//     const type = typeof value;
//     switch (type) {
//         case 'function': return String(value);
//         case 'undefined': return 'undefined';
//         case 'object': return stringify(value);
//         case 'string': return '"' + String(value).split('\n').join('\\n') + '"';
//     }
//     return `${value}(${type})`;
// }

// const css: Css = {
//     '&Container': {
//         flex: 1,
//     },
//     '&Container .Actions': { ...flexRow({ align: 'center', justify: 'around' }), p: 0.5 },
//     '&Container .Button': { flex: 1, m: 0.5 },
//     '&Container .LoadBtn': { position: 'fixed', bottom: "1em", right: "1em" },
//     '&Logs': { 
//         position: 'absolute',
//         inset: 0,
//         overflow: 'auto',
//     },
//     '&': {
//         ...flexRow({ align: 'center' }),
//         minHeight: "1em",
//         fontSize: "0.5em",
//         my: 0.1,
//         overflowX: 'auto',
//         overflowY: 'hidden',
//     },
//     '&-info': { color: 'default' },
//     '&-error': { color: 'error' },
//     '&-warn': { color: 'warn' },
//     '& span': { width: "5em", m: 0 },
//     '& pre': { flex: 1, m: 0 },
// };

// const Log = ({ log, c } : { log: M4kLog, c: string }) => {
//     return (
//         <Div cls={`${c} ${c}-${(log.level||'info').toLowerCase()}`}>
//             <span>{log.level}</span>
//             <pre>{log.message}</pre>
//             <pre>{showValue(log)}</pre>
//         </Div>
//     )
// }

// export const LogsPage = () => {
//     const c = useCss('Log', css);
//     const logsRef = useRef<HTMLDivElement>(null);
//     const [logs, setLogs] = useState<M4kLog[]>([]);
//     const [isLoad, setLoad] = useState(true);

//     useEffect(() => autoScrollEnd(logsRef.current), [logsRef]);

//     useEffect(() => {
//         const timer = setInterval(async () => {
//             if (!isLoad) return;
//             const newLogs = await m4k.popLogs(20);
//             if (!isList(newLogs)) return;
//             setLogs(logs => {
//                 const next = [ ...logs, ...newLogs ];
//                 if (next.length > 200) next.splice(0, next.length-10);
//                 return next
//             });
//         }, 500);
//         return () => clearInterval(timer);
//     }, []);

//     return (
//         <div className="m4kLogsPage">
//             <Button className="LoadBtn" onClick={() => setLoad(v => !v)}>
//                 {isLoad ? 'STOP' : 'LOAD'}
//             </Button>
//             <div ref={logsRef} className="m4kLogsPageLogs">
//                 {logs.map((log, i) => (
//                     <Log c={c} key={i} log={log} />
//                 ))}
//             </div>
//         </div>
//     )
// }
