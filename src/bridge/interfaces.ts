import type { glb, Dictionary, Logger } from 'fluxio';

export interface BridgeExecResult {
  cmd: string;
  out: string;
  err: string;
  code: number;
}

export interface BridgeFileInfo {
  type: 'file' | 'dir' | '';
  path: string;
  mimeType: string;
  size: number;
  accessed: number;
  modified: number;
  created: number;
  url: string;
  width?: number;
  height?: number;
}

export interface BridgeLog {
  tag?: string;
  level: string;
  message: string;
  data?: any;
  source?: string;
  line?: number;
}

// export type PlaylistItem = BridgeFileInfo & {
//     waitMs?: number
// }

// export interface BridgeSettings {
//     // kioskPassword?: string;
//     // deviceEmail?: string;
//     // devicePassword?: string;
//     // isKioskOn?: boolean;
//     // isScreenOn?: boolean;
//     // screenOrientation?: "landscape" | "portrait" | "reverse_landscape" | "reverse_portrait";
//     // injectJs?: string;
//     // url?: string;
//     // backColor?: string;
//     // initialScale?: number;
//     // // isDebugging?: boolean
//     // // isSupportZoom?: boolean
//     // // hasDomStorage?: boolean
//     // // isOverviewMode?: boolean
//     // // isUseViewPort?: boolean
//     // // hasContentAccess?: boolean
//     // // hasFileAccess?: boolean
//     // // hasZoomControls?: boolean
//     // // displayZoomControls?: boolean
//     // // hasMediaPlaybackRequiresUserGesture?: boolean
//     // textZoom?: number;
//     // mixedContent?: "never" | "compatible" | "always";
//     // readTimeout?: number;
//     // itemAnim?: 'rightToLeft' | 'topToBottom' | 'fade' | 'zoom';
//     // itemDurationMs?: number;
//     // itemFit?: 'contain' | 'cover' | 'fill';
//     // hasVideoMuted?: boolean;
//     // views?: {
//     //     [key: string]: BridgeViewConfig;
//     // };
// }

// export interface BridgeConfig {
//   ///// URL /////
//   startUrl?: string;
//   zipUrl?: string;
//   url?: string;

//   ///// Authentication /////
//   password?: string;

//   ///// Playlist /////
//   copyDir?: string;
//   itemDurationMs?: number;
//   itemFit?: 'contain' | 'cover' | 'fill';
//   itemAnim?: 'rightToLeft' | 'topToBottom' | 'fade' | 'zoom';
//   hasVideoMuted?: boolean;
//   playlist?: any[];

//   ///// UI /////
//   backColor?: string;

//   ///// Device /////
//   deviceUsername?: string;
//   devicePassword?: string;

//   ///// Cache /////
//   deleteCacheOnReload?: boolean;
//   deleteHistoryOnReload?: boolean;
//   deleteStorageOnReload?: boolean;
//   deleteCookiesOnReload?: boolean;
//   syncBridgeStorage?: boolean;

//   ///// App /////
//   restartOnCrash?: boolean;
//   restartHours?: number; // 22h30 -> 22,5
//   rebootHours?: number; // 22h30 -> 22,5
//   reloadIdle?: number;
//   appToRunOnStart?: string;

//   ///// Screen /////

//   /** Screen orientation (0=portrait, 1=landscape, etc.) */
//   screenOrientation?: number;
//   keepScreenOn?: boolean;
//   screenStartHours?: string; // 22h30 -> 22,5
//   screenEndHours?: string; // 22h30 -> 22,5

//   ///// Kiosk //////
//   showActionBar?: boolean;
//   showStatusBar?: boolean;
//   launchOnBoot?: boolean;
//   kioskPin?: string;
//   kioskMode?: string;
//   forceImmersive?: boolean;
//   hideKeyboard?: boolean;
//   allowTextSelection?: boolean;
//   confirmExit?: boolean;

//   ///// Server /////
//   enableLocalhost?: boolean;

//   ///// WiFi /////
//   resetWifiOnDisconnection?: boolean;
//   resetWifiEachSeconds?: number;
//   wifiType?: string;
//   wifiName?: string;
//   wifiPass?: string;

//   ///// Idle /////
//   reloadEachSeconds?: number;

//   ///// Zoom /////
//   initialScale?: number;
//   textZoom?: number;
//   enableZoom?: boolean;
//   resetZoom?: number;
//   resetZoomMs?: number;
//   builtInZoomControls?: boolean;
//   displayZoomControls?: boolean;

//   ///// InjectJs /////
//   injectSh?: string;
//   injectJs?: string;

//   ///// WebView //////
//   debuggingEnabled?: boolean;
//   domStorageEnabled?: boolean;
//   loadWithOverviewMode?: boolean;
//   useWideViewPort?: boolean;
//   allowContentAccess?: boolean;
//   allowFileAccess?: boolean;
//   mediaPlaybackRequiresUserGesture?: boolean;
//   mixedContentMode?: 'never' | 'compatible' | 'always';
//   webviewMixedContent?: number; // TODO
//   desktopMode?: boolean;
//   customUserAgent?: string;
//   autoplayVideo?: boolean;
// }

// interface BridgeConfig {
//     kiosk?: boolean;
//     startUrl?: string;
//     logs?: boolean;
//     injectJs?: string|string[];
//     readyJs?: string|string[];
//     screenRotate?: number;
//     webviewRotate?: number;
//     idleMs?: number;
//     updateMs?: number;
//     captureMs?: number;
// }

export interface BridgeDeviceInfo {
  webview?: string;
  type?: string;
  os?: string;
  ip?: string;
  width?: number;
  height?: number;
  storage?: string;
  model?: string;
  architecture?: string;
  started?: string | Date;
}

export interface BridgePackageInfo {
  packageName: string;
  appName: string;
  category: number;
  flags: number;
  dataDir: string;
  enabled: boolean;

  versionName?: string;
  versionCode?: number;

  isSystemApp: boolean;
  isUpdatedSystemApp: boolean;

  permissions?: string[];

  activities?: {
    package: string;
    name: string;
    exported: boolean;
  }[];

  mainActivities?: {
    package: string;
    name: string;
    exported: boolean;
  }[];

  intentFilters?: {
    activity: string;
    filters: {
      actions?: string[];
      categories?: string[];
      schemes?: string[];
      authorities?: {
        host: string;
        port: number;
      }[];
      paths?: string[];
    }[];
  }[];
}

export type BridgeFlag =
  | 'broughtToFront'
  | 'clearTask'
  | 'clearTop'
  | 'clearWhenTaskReset'
  | 'excludeFromRecents'
  | 'forwardResult'
  | 'launchedFromHistory'
  | 'launchAdjacent'
  | 'matchExternal'
  | 'multipleTask'
  | 'newDocument'
  | 'newTask'
  | 'noAnimation'
  | 'noHistory'
  | 'noUserAction'
  | 'previousIsTop'
  | 'reorderToFront'
  | 'requireDefault'
  | 'requireNonBrowser'
  | 'resetTaskIfNeeded'
  | 'retainInRecents'
  | 'singleTop'
  | 'taskOnHome'
  | 'debugLogResolution'
  | 'directBootAuto'
  | 'excludeStoppedPackages'
  | 'fromBackground'
  | 'grantPersistableUriPermission'
  | 'grantPrefixUriPermission'
  | 'grantReadUriPermission'
  | 'grantWriteUriPermission'
  | 'includeStoppedPackages'
  | 'receiverForeground'
  | 'receiverNoAbort'
  | 'receiverRegisteredOnly'
  | 'receiverReplacePending'
  | 'receiverVisibleToInstantApps';

export interface BridgeIntentOptions {
  uri?: string;
  action?: string;
  type?: string;
  package?: string;
  component?: string;
  flags?: BridgeFlag[] | number;
  categories?: string[];
  extras?: Dictionary<any>;
}

export type BridgePath = string | string[];
export type _BridgeEvent =
  | {
      type: 'touch';
      action: 'up' | 'down' | 'move';
      x: number;
      y: number;
      xRatio: number;
      yRatio: number;
    }
  | { type: 'storage'; action: 'mounted' | 'removed' | 'unmounted' | 'eject'; path: 'string' }
  | { type: 'test' };
export type BridgeEvent = _BridgeEvent & { id: string };
export type BridgeSignalEvent = _BridgeEvent & { id?: string };

// TODO update on apk
export type BridgeResizeOptions = {
  dest?: BridgePath;
  quality?: number;
  format?: 'jpeg' | 'png';
  min?: number | [number, number]; // widthHeight | [width, height]
  max?: number | [number, number]; // widthHeight | [width, height]
  // transform?: '90deg'|'180deg'|'270deg'|'flipX'|'flipY',
};

export interface Bridge {
  app: Dictionary<any>;
  global: typeof glb;
  isInterface: boolean;

  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string | null): Promise<void>;
  clearSettings(): Promise<void>;

  pressKey(key: string): Promise<void>;
  tap(x: number, y: number): Promise<void>;
  swipe(x: number, y: number, xEnd: number, yEnd: number, ms: number): Promise<void>;
  move(x: number, y: number): Promise<void>;
  down(x: number, y: number): Promise<void>;
  up(x: number, y: number): Promise<void>;
  inputText(text: string): Promise<void>;

  loadJs(path: string): Promise<{ success: boolean; value?: any; error?: string }>;
  evalJs(script: string): Promise<{ success: boolean; value?: any; error?: string }>;
  su(cmd: string): Promise<BridgeExecResult>;
  sh(cmd: string): Promise<BridgeExecResult>;

  fileInfo(path: BridgePath): Promise<BridgeFileInfo>;
  absolutePath(path: BridgePath): Promise<string>;
  mkdir(path: BridgePath): Promise<boolean>;
  ls(path: BridgePath, recursive?: boolean): Promise<string[]>;
  cp(path: BridgePath, dest: BridgePath): Promise<boolean>;
  mv(path: BridgePath, dest: BridgePath): Promise<boolean>;
  rm(path: BridgePath): Promise<boolean>;
  zip(path: BridgePath, dest?: BridgePath, uncompressed?: boolean): Promise<string>;
  unzip(path: BridgePath, dest?: BridgePath): Promise<string>;

  download(url: string, dest?: BridgePath): Promise<void>;

  pdfToImages(
    path: BridgePath,
    options?: BridgeResizeOptions & { pages?: number[] }
  ): Promise<BridgeFileInfo[]>;
  resize(path: BridgePath, options?: BridgeResizeOptions): Promise<string>;
  capture(options?: BridgeResizeOptions): Promise<string>;

  read(path: string, encoding?: 'utf8' | 'base64'): Promise<string | undefined>;
  write(
    path: string,
    content: string,
    encoding?: 'utf8' | 'base64',
    append?: boolean
  ): Promise<void>;
  url(path: string): Promise<string>;
  reboot(): Promise<void>;
  restart(): Promise<void>;
  reload(): Promise<void>;
  exit(): Promise<void>;
  deviceInfo(): Promise<BridgeDeviceInfo>;
  setKioskOn(val: boolean): Promise<void>;
  setScreenOn(val: boolean): Promise<void>;

  installedPackages(): Promise<String[]>;
  packageInfo(name: String): Promise<BridgePackageInfo>;
  startIntent(options: BridgeIntentOptions): Promise<void>;
  installApk(path?: BridgePath): Promise<void>;

  subscribe(listener?: (event: BridgeEvent) => void): () => void;
  signal(event: BridgeSignalEvent): void;

  log: Logger;
}

export type BridgeAsyncMethods = keyof Omit<
  Bridge,
  'isInterface' | 'app' | 'global' | 'log'
>;

export type BridgeMethodAsyncOrSync<T> =
  T extends (...args: infer A) => Promise<infer R> ? (...args: A) => Promise<R> | R : T;

export type BridgeMethodsAsyncOrSync<T> = {
  [P in keyof T]?: BridgeMethodAsyncOrSync<T[P]>;
};
