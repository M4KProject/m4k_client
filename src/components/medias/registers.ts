import { ImageView } from './ImageView';
import { addComp } from './MediaView';
import { PdfView } from './PdfView';
import { PlaylistView } from './PlaylistView';

addComp('image', ImageView);
addComp('playlist', PlaylistView);
addComp('pdf', PdfView);
