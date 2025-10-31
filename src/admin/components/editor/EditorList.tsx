export {};

// import Box from '@mui/material/Box';
// import { useEffect, useState } from 'react';
// import Loading from './Loading';
// import Typography from '@mui/material/Typography';
// import AddIcon from '@mui/icons-material/Add';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import DeleteIcon from '@mui/icons-material/Delete';
// import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
// import { useFlux } from 'vegi';
// import { auth } from '../api/Auth';

// export default function EditorList() {
//   const { userId } = useFlux(auth.session$);
//   const projectId = useFlux(projectCtrl.projectId$);
//   const editors = useFlux(editorCtrl.editors$);
//   const loadingDico = useFlux(editorCtrl.loadingDico$);

//   const [email, setEmail] = useState('');

//   useEffect(() => {
//     editorCtrl.refreshEditors();
//   }, []);

//   console.debug('EditorList', userId);

//   const isLoading = Object.values(loadingDico).includes(true);

//   if (projectId === null) return null;
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         borderBottom: '1px solid black',
//         borderLeft: '8px solid #d1d1d1',
//       }}
//     >
//       <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', p: 0.5 }}>
//         <Typography sx={{ m: 0.5 }}>Membre du projet :</Typography>
//         {editors.map((editor) => (
//           <Box
//             key={editor.id}
//             sx={{
//               m: 0.5,
//               p: 1,
//               border: '1px solid black',
//             }}
//           >
//             {editor.user.email}
//             {editor.project.ownerId !== editor.userId && (
//               <IconButton sx={{ mr: -1, my: -2 }} onClick={() => editorCtrl.deleteEditor(editor.id)}>
//                 <DeleteIcon />
//               </IconButton>
//             )}
//           </Box>
//         ))}
//         <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', m: 0.5 }}>
//           <TextField
//             sx={{ m: 0.5 }}
//             size="small"
//             label="Adresse e-mail :"
//             value={email}
//             onChange={(e) => setEmail(String(e.target.value))}
//             InputProps={{
//               endAdornment: (
//                 <IconButton onClick={() => editorCtrl.addEditor(email)} color="primary">
//                   <AddIcon />
//                 </IconButton>
//               ),
//             }}
//           />
//         </Box>
//         <Box sx={{ flex: 1 }} />
//         <IconButton sx={{ m: 0.5 }} onClick={() => editorCtrl.refreshEditors()} color="primary">
//           <RefreshIcon />
//         </IconButton>
//       </Box>
//       {isLoading && <Loading />}
//     </Box>
//   );
// }
