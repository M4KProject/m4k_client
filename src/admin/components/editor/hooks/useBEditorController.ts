import { BEditorController } from '../BEditorController';

let bEditorController: BEditorController;
export const useBEditorController = () => {
  return bEditorController || (bEditorController = new BEditorController());
};
