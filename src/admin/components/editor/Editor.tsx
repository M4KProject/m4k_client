import Box from '@mui/material/Box';
import EdViewport from './EdViewport';
import { editorCtrl } from '../../controllers/EditorController';
import { useEffect } from 'react';
import EdFabs from './EdFabs';
import EdTerminal from './EdTerminal';
import router from '../../../helpers/router';
import { useMsg } from 'vegi';
import EdSide from './EdSide';

export default function Editor() {
  console.debug('Editor');

  useMsg(router.updated$);
  const siteKey = router.current.params.siteKey || 'demo';

  useEffect(() => {
    editorCtrl.siteKey$.set(siteKey);
  }, [siteKey]);

  return (
    <Box
      className="Editor"
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EdViewport />
      <EdTerminal />
      <EdSide />
      <EdFabs />
    </Box>
  );
}

//   const validationSchema = Yup.object().shape({
//     title: Yup.string().max(255).required('Le titre est requis'),
//     key: Yup.string().max(255).required('La clé est requis'),
//     public: Yup.boolean(),
//   });

//   if (!site) return null;
//   return (
//     <Box
//       key={site.id}
//       sx={{
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: "center",
//         justifyContent: "center"
//       }}
//     >
//       <Card
//         variant="outlined"
//         sx={{
//           minWidth: '320px',
//           boxShadow: 3,
//           form: {
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'strech',
//             p: 2,
//           },
//           '.MuiTextField-root': { m: 1 },
//         }}
//       >
//         <Formik
//           initialValues={site}
//           validationSchema={validationSchema}
//           onReset={async () => {
//             console.debug('onReset', site);
//           }}
//           onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//             console.debug('onSubmit', { values, setErrors, setStatus, setSubmitting });
//             try {
//               // const { success, message, errors } = await authAction(email, password);
//               // setStatus({ success, message });
//               // if (errors) setErrors(errors);
//               setStatus({ success: true });
//             } catch (error: any) {
//               console.error('onSubmit error', error);
//               setStatus({ success: false });
//               // setErrors({ submit: String(error) });
//               setSubmitting(false);
//             }
//           }}
//         >
//           {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, status, setErrors }) => {
//             console.debug('formik', { errors, isSubmitting, touched, values, status });
//             return (
//               <form noValidate onSubmit={handleSubmit}>
//                 <TextField
//                   sx={{ m: 1 }}
//                   name="title"
//                   label="Titre :"
//                   value={values.title||''}
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   error={!!(touched.title && errors.title)}
//                 />
//                 <TextField
//                   sx={{ m: 1 }}
//                   name="key"
//                   label="Clé du site :"
//                   value={values.key||''}
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   error={!!(touched.key && errors.key)}
//                 />
//                 <FormControlLabel sx={{ m: 1 }} control={(
//                   <Switch
//                     name="public"
//                     checked={!!values.public}
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     color={(touched.public && errors.public) ? "error" : "default"}
//                   />
//                 )} label="Publier" />
//                 {status?.message && (
//                   <Box sx={{ m: 1 }} color="success">
//                     {status.message}
//                   </Box>
//                 )}
//                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
//                   <Button
//                     variant="contained"
//                     sx={{ flex: 1, m: 1 }}
//                     disabled={isLoading || isSubmitting}
//                     type="submit"
//                   >
//                     Enregistrer
//                   </Button>
//                   <Button
//                     color="error"
//                     variant="contained"
//                     sx={{ flex: 1, m: 1 }}
//                     disabled={isLoading || isSubmitting}
//                     type="reset"
//                   >
//                     Annuler
//                   </Button>
//                 </Box>
//               </form>
//             );
//           }}
//         </Formik>
//       </Card>
//     </Box>
//   );
// }
