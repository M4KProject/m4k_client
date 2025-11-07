import type { glb } from 'fluxio';
import type { Dictionary } from 'fluxio';

export interface M4kExecResult {
  cmd: string;
  out: string;
  err: string;
  code: number;
}

export interface M4kFileInfo {
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

export interface M4kLog {
  tag?: string;
  level: string;
  message: string;
  data?: any;
  source?: string;
  line?: number;
}

// export type PlaylistItem = M4kFileInfo & {
//     waitMs?: number
// }

// export interface M4kSettings {
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
//     //     [key: string]: M4kViewConfig;
//     // };
// }

// export interface M4kConfig {
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
//   syncM4kStorage?: boolean;

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

export interface M4kDeviceInfo {
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

export interface M4kPackageInfo {
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

export type M4kFlag =
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

export interface M4kIntentOptions {
  uri?: string;
  action?: string;
  type?: string;
  package?: string;
  component?: string;
  flags?: M4kFlag[] | number;
  categories?: string[];
  extras?: Dictionary<any>;
}

export type M4kPath = string | string[];
export type _M4kEvent =
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
export type M4kEvent = _M4kEvent & { id: string };
export type M4kSignalEvent = _M4kEvent & { id?: string };

// TODO update on apk
export type M4kResizeOptions = {
  dest?: M4kPath;
  quality?: number;
  format?: 'jpeg' | 'png';
  min?: number | [number, number]; // widthHeight | [width, height]
  max?: number | [number, number]; // widthHeight | [width, height]
  // transform?: '90deg'|'180deg'|'270deg'|'flipX'|'flipY',
};

export interface M4Kiosk {
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
  su(cmd: string): Promise<M4kExecResult>;
  sh(cmd: string): Promise<M4kExecResult>;

  fileInfo(path: M4kPath): Promise<M4kFileInfo>;
  absolutePath(path: M4kPath): Promise<string>;
  mkdir(path: M4kPath): Promise<boolean>;
  ls(path: M4kPath, recursive?: boolean): Promise<string[]>;
  cp(path: M4kPath, dest: M4kPath): Promise<boolean>;
  mv(path: M4kPath, dest: M4kPath): Promise<boolean>;
  rm(path: M4kPath): Promise<boolean>;
  zip(path: M4kPath, dest?: M4kPath, uncompressed?: boolean): Promise<string>;
  unzip(path: M4kPath, dest?: M4kPath): Promise<string>;

  download(url: string, dest?: M4kPath): Promise<void>;

  pdfToImages(
    path: M4kPath,
    options?: M4kResizeOptions & { pages?: number[] }
  ): Promise<M4kFileInfo[]>;
  resize(path: M4kPath, options?: M4kResizeOptions): Promise<string>;
  capture(options?: M4kResizeOptions): Promise<string>;

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
  deviceInfo(): Promise<M4kDeviceInfo>;
  setKioskOn(val: boolean): Promise<void>;
  setScreenOn(val: boolean): Promise<void>;

  installedPackages(): Promise<String[]>;
  packageInfo(name: String): Promise<M4kPackageInfo>;
  startIntent(options: M4kIntentOptions): Promise<void>;
  installApk(path?: M4kPath): Promise<void>;

  subscribe(listener?: (event: M4kEvent) => void): () => void;
  signal(event: M4kSignalEvent): void;

  d(...args: any[]): void;
  i(...args: any[]): void;
  w(...args: any[]): void;
  e(...args: any[]): void;
}

export type M4KAsyncMethods = keyof Omit<
  M4Kiosk,
  'isInterface' | 'app' | 'global' | 'd' | 'i' | 'w' | 'e'
>;
