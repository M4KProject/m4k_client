import { PProps } from './interfaces';
import { B } from './B';
import { Button } from '@common/components';

// import * as UpChunk from '@mux/upchunk';
// const upload = UpChunk.createUpload({
//   // getUploadUrl is a function that resolves with the upload URL generated
//   // on the server-side
//   endpoint: getUploadUrl,
//   // picker here is a file picker HTML element
//   file: picker.files[0],
//   chunkSize: 5120, // Uploads the file in ~5mb chunks
// });
// // subscribe to events
// upload.on('error', err => {
//   console.error('💥 🙀', err.detail);
// });
// upload.on('progress', progress => {
//   console.log('Uploaded', progress.detail, 'percent of this file.');
// });
// // subscribe to events
// upload.on('success', err => {
//   console.log("Wrap it up, we're done here. 👋");
// });

const formatSx: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  '& i': {
    fontSize: '0.8em',
  },
};

const videoFormats = {
  '': '',
  mp4: 'MP4',
  webm: 'WebM',
  jpg: 'Image',
};

const imageFormats = {
  '': '',
  jpg: 'JPG',
  png: 'PNG',
};

const resolutions = {
  '': '',
  '48': 'Icon',
  '240': 'Miniature',
  '480': 'SD',
  '720': 'HD',
  '1080': 'FullHD',
  '2160': '4K',
};

const FileInputProgress = ({
  progress$,
  color,
}: {
  progress$: Msg<number>;
  color: 'primary' | 'secondary';
}) => {
  const progress = useFlux(progress$);
  if (progress === 0 || progress === 1) return null;
  return <LinearProgress variant="determinate" value={progress * 100} color={color} />;
};

const isPdf = (p: string | undefined) => {
  return p === 'pdf' || p === 'doc';
};

const FileInput = ({ v, setV, b, p }: PProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const values = toString(v).split('/');

  const progress1$ = useMemo(() => flux(0), [b, p]);
  const progress2$ = useMemo(() => flux(0), [b, p]);
  const mediaId$ = useMemo(() => flux(values[0] || ''), [b, p]);
  const output$ = useMemo(() => flux(values[1] || ''), [b, p]);
  const media$ = useMemo(() => flux<MediaData | null>(null), [b, p]);
  const value$ = useMemo(() => flux(v), [b, p]);

  const progress1 = useFlux(progress1$);
  const progress2 = useFlux(progress2$);
  const mediaId = useFlux(mediaId$);
  const output = useFlux(output$);
  const media = useFlux(media$);
  const value = useFlux(value$);

  useEffect(() => {
    if (v !== value) {
      setV(value);
      b?.render();
    }
  }, [v, value]);

  const outputs = media?.outputs || {};

  // const isUrl = value.startsWith('http');

  const refreshMedia = async () => {
    try {
      const mediaId = mediaId$.val;
      if (!mediaId) return media$.set(null);

      const media = await api.rest.get<MediaData>(`medias/${mediaId}`);
      media$.set(media);

      if (!media) return;

      progress1$.set(1);

      if (media.progress && media.progress < 1) {
        progress2$.set(media.stage === 'end' ? 1 : media.progress);
      }

      if (media.stage !== 'end') return;

      progress2$.set(1);

      const outputs = media?.outputs || {};

      if (isPdf(p)) {
        output$.set('pdf');
        if (b && b.children.length === 0) {
          b.update({
            children: Object.keys(outputs)
              .filter((name) => !name.includes('.hd.jpg'))
              .map((name) => ({
                t: 'img',
                bgImg: `${mediaId}/${name}`,
              })),
          });
        }
      } else if (p === 'video') {
        output$.set('video');
      } else if (Object.keys(outputs).length > 0 && !outputs[output$.val]) {
        output$.set(Object.keys(outputs)[0]);
      }

      const newValue = outputs[output$.val] ? `${mediaId}/${output$.val}` : `${mediaId}/source`;
      value$.set(newValue);
    } catch (error) {
      console.error('FileInput interval', mediaId, error);
    }
  };

  useEffect(() => {
    refreshMedia();
    const interval = setInterval(refreshMedia, 5000);
    return () => clearInterval(interval);
  }, [mediaId]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    console.debug('PFileInput onChange', e);
    try {
      const file = (e.target.files || [])[0];
      if (!file) return;

      // const formData = toFormData({});
      // formData.append('file', file);

      const siteId = toString(editorCtrl.site$.val?.id, '');
      // formData.append('siteId', siteId)

      // console.debug('formData', formData);

      setV('');
      mediaId$.set('');
      media$.set(null);
      progress1$.set(0.01);
      progress2$.set(0);

      const mediaUpload = await api.rest.post<MediaData>(`medias/upload`, undefined, {
        formData: {
          file,
          siteId,
        },
        // before: (ctx) => {
        //   console.debug('xhr', ctx.xhr);
        //   ctx.options.xhr?.addEventListener("progress", (event) => {
        //     console.debug('PFileInput progress', event);
        //   });
        //   ctx.options.xhr?.upload.addEventListener("progress", (event) => {
        //     console.debug('PFileInput upload progress', event, event.loaded);
        //   });
        // },
        onProgress: (progress) => {
          console.debug('PFileInput onProgress', progress);
          progress1$.set(progress);
        },
        timeout: 10 * 60 * 1000,
      });

      console.debug('PFileInput onChange success', mediaUpload);
      if (!mediaUpload) return;

      mediaId$.set(mediaUpload.id || '');
      media$.set(mediaUpload);

      value$.set(`${mediaId}/source`);

      if (b && isPdf(p)) b.update({ children: [] });

      setTimeout(refreshMedia, 500);
      setTimeout(refreshMedia, 1000);
      setTimeout(refreshMedia, 2000);
    } catch (e) {
      addAlert('error', 'Problème lors du téléchargement');
    }
  };

  console.debug('FileInput', p, v);

  // accept="image/*"
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '& .MuiTextField-root': {
          flex: 1,
        },
        '& .PInputFile': {
          opacity: 0,
          width: 0,
          height: 0,
        },
        '& .PInputFileName': {
          fontSize: '80%',
          textAlign: 'center',
          color: 'gray',
        },
        '& .PInputActions': {
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        '& .PFileResolution': {
          flex: 1,
        },
        '& .PFileFormat': {
          flex: 1,
        },
      }}
    >
      {/*<TextField size="small" label="URL" value={value} onChange={(e) => setV(e.target.value)} />*/}
      <div className="PInputActions">
        <TextField
          label="Format"
          className="PFileFormat"
          size="small"
          select
          value={output}
          onChange={(e) => {
            output$.set(e.target.value);
          }}
        >
          <MenuItem value={output}>{output}</MenuItem>
          {Object.keys(outputs)
            .filter((name) => name !== output)
            .map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
        </TextField>
        <input
          className="PInputFile"
          ref={inputRef}
          type="file"
          accept="*"
          onChange={handleChange}
        />
        <Tooltip title="Envoyer une nouvelle image">
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              console.debug('FileButton upload onClick', e);
              inputRef.current?.click();
            }}
          >
            <UploadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Téléchargez le fichier source">
          <IconButton
            size="small"
            color="secondary"
            href={B.url(v)}
            download={media?.name}
            target="_blank"
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </div>
      <FileInputProgress progress$={progress1$} color="primary" />
      <FileInputProgress progress$={progress2$} color="secondary" />
      <div className="PInputFileName">{media?.name}</div>
    </Box>
  );
};

export const PFile = (props: PProps) => {
  return (
    <div className="PInput">
      <FileInput {...props} />
    </div>
  );
};

export const PFiles = (props: PProps) => {
  return (
    <div className="PInput" style={{ flexDirection: 'column' }}>
      <FileInput {...props} />
      <FileInput {...props} />
      <Button startIcon={<AddIcon />}>Ajouter</Button>
    </div>
  );
}
