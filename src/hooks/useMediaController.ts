import { MediaController } from "@/controllers/MediaController";
import { useSingleton } from "./useSingleton";

export const useMediaController = () => useSingleton(MediaController);
