import { ImageView } from './ImageView';
import { addComp } from './MediaView';
import { PdfView } from './PdfView';
import { PlaylistView } from './PlaylistView';
import { VideoView } from './VideoView';

addComp('image', ImageView);
addComp('video', VideoView);
addComp('playlist', PlaylistView);
addComp('pdf', PdfView);
