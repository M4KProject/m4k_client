import { DeviceController } from "@/controllers/DeviceController"
import { isFunction } from "fluxio";

interface Ioc {
    <T>(constructor: new T) => T;
    <T>(factory: () => T) => T;
}

export const ioc = (namescpace: string) => {


    return <T>(factory: new T) => {

    }


    isFunction(factory) ? factory() : 
}

ioc(DeviceController)

iocScope(base)
    iocScope(device)