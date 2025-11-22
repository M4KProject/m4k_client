import { DeviceController } from "@/controllers/DeviceController";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export const DeviceContext = createContext<DeviceController | undefined>(undefined);

export const useDeviceController = () => useContext(DeviceContext)!;