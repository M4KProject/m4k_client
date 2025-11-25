import { MediaModel } from "@/api/models";
import { flux, logger } from "fluxio";

export class MediaController {
  log = logger('MediaController');
  parent$ = flux<MediaModel|null>(null);


}
