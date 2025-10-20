// @ts-ignore
var g =
    typeof globalThis === 'object' ? globalThis :
    typeof window === 'object' ? window : 
    typeof global === 'object' ? global :
    {};

if (!g.globalThis) g.globalThis = g;
if (!g.window) g.window = g;
if (!g.global) g.global = g;