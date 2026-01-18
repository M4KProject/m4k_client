import { app } from "@/app";
import { Api } from "./Api";
export * from './ApiClient';
export * from './ApiHelpers';
export * from './ApiMedias';
export * from './ApiRest';
export * from './models';

export const api2 = new Api();

app.api2 = api2;