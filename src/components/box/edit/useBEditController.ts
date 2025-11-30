import { useBController } from "../useBController";
import { BEditController } from "./BEditController";

export const useBEditController = () => {
    const controller = useBController();
    if (controller instanceof BEditController) return controller;
    return undefined;
}