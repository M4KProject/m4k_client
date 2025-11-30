import { createContext } from "preact";
import { BController } from "./BController";
import { useContext } from "preact/hooks";

export const BContext = createContext<BController | undefined>(undefined);

export const useBController = () => useContext(BContext);