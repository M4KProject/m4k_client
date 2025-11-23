import { isFunction } from "fluxio";
import { Content } from "./types";
import { createElement } from "preact";

export const getContent = (content: Content) => isFunction(content) ? createElement(content, {}) : content || null;