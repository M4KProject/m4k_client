// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import { useState } from "react";
// import BEdit from "../admin/BEdit";
// import Item from "./Item";

// export default function Search() {
//     const [value, setValue] = useState('');
//     const tags = value.toLowerCase().split(' ');
//     const bs: BEdit[] = [];

//     const rec = (b: BEdit) => {
//         const d = { ...b.d };
//         delete d.children;
//         const txt = Object.values(d).filter(v => typeof v !== 'object').join(' ').toLowerCase();
//         if (!tags.find(tag => !txt.includes(tag))) {
//             console.debug(txt);
//             bs.push(b);
//         }
//         b.children.forEach(rec);
//     }
//     rec(B.root);

//     return (
//         <Box
//             className="Search"
//             sx={{
//                 width: 200,
//                 borderRight: '1px solid grey',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'stretch',
//                 justifyContent: 'space-around',
//                 p: 1,
//                 '& .SearchList': {
//                     flex: 1,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'stretch',
//                     overflow: 'hidden',
//                     overflowY: 'auto',
//                     height: '100%',
//                 }
//             }}
//         >
//             <TextField size="small" value={value} onChange={(e) => setValue(e.target.value)} />
//             <div className="SearchList">
//                 {bs.map((b, i) => (
//                     <Item key={i} b={b} hideChildren={true} />
//                 ))}
//             </div>
//         </Box>
//     )
// }

export default {};
