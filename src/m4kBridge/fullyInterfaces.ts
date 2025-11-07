export interface FileInfo {
  type: 'folder' | 'file';
  name: string;
  size: number;
  lastModified: number;
  canRead: boolean;
  canWrite: boolean;
  isHidden: boolean;
  path: string;
}

export interface Fully {
  ////// Get device info
  // Information about device hardware and system

  /** Get current system locale (e.g. "en_US") */
  getCurrentLocale(): string;

  /** Get IPv4 address of the device */
  getIp4Address(): string;

  /** Get IPv6 address of the device */
  getIp6Address(): string;

  /** Get device hostname for IPv4 */
  getHostname(): string;

  /** Get device hostname for IPv6 */
  getHostname6(): string;

  /** Get MAC address of primary network interface */
  getMacAddress(): string;

  /** Get MAC address for specific network interface */
  getMacAddressForInterface(interfaceName: string): string;

  /** Get SSID of connected WiFi network */
  getWifiSsid(): string;

  /** Get BSSID of connected WiFi access point (ver. 1.44+) */
  getWifiBssid(): string; // ver. 1.44+

  /** Get WiFi signal strength level (ver. 1.30+) */
  getWifiSignalLevel(): string; // ver. 1.30+

  /** Get device serial number */
  getSerialNumber(): string;

  /** Get unique Android ID */
  getAndroidId(): string;

  /** Get device identifier */
  getDeviceId(): string;

  /** Get user-defined device name */
  getDeviceName(): string;

  /** Get IMEI number for devices with cellular capability */
  getImei(): string;

  /** Get SIM card serial number */
  getSimSerialNumber(): string;

  /** Get current battery level (0-100) */
  getBatteryLevel(): number;

  /** Get current screen brightness (0-255) */
  getScreenBrightness(): number;

  /** Get current screen orientation (0=portrait, 1=landscape, etc.) (ver. 1.40.2+) */
  getScreenOrientation(): number; // ver. 1.40.2+

  /** Get display width in pixels */
  getDisplayWidth(): number;

  /** Get display height in pixels */
  getDisplayHeight(): number;

  /** Check if screen is currently on */
  getScreenOn(): boolean;

  /** Check if device is plugged into power */
  isPlugged(): boolean;

  /** Check if virtual keyboard is visible */
  isKeyboardVisible(): boolean;

  /** Check if WiFi is enabled */
  isWifiEnabled(): boolean;

  /** Check if WiFi is connected (ver. 1.44+) */
  isWifiConnected(): boolean; // ver. 1.44+

  /** Check if any network connection is available (ver. 1.44+) */
  isNetworkConnected(): boolean; // ver. 1.44+

  /** Check if Bluetooth is enabled */
  isBluetoothEnabled(): boolean;

  /** Check if screen rotation is locked (ver. 1.40.2+) */
  isScreenRotationLocked(): boolean; // ver. 1.40.2+

  /** Get Fully Kiosk Browser version string */
  getFullyVersion(): string;

  /** Get Fully Kiosk Browser version code */
  getFullyVersionCode(): number;

  /** Get WebView version */
  getWebviewVersion(): string;

  /** Get Android OS version */
  getAndroidVersion(): string;

  /** Get Android SDK version */
  getAndroidSdk(): number;

  /** Get device model name */
  getDeviceModel(): string;

  // Get storage info (ver. 1.33+)
  // Device storage information

  /** Get total internal storage space in bytes */
  getInternalStorageTotalSpace(): number;

  /** Get free internal storage space in bytes */
  getInternalStorageFreeSpace(): number;

  /** Get total external storage space in bytes */
  getExternalStorageTotalSpace(): number;

  /** Get free external storage space in bytes */
  getExternalStorageFreeSpace(): number;

  // Get environment sensor info (ver. 1.40+)
  // Access device sensors

  /** Get JSON string with available sensors information */
  getSensorInfo(): string;

  /** Get single sensor value by type (see Android Sensor types) */
  getSensorValue(type: number): number;

  /** Get JSON array of sensor values by type */
  getSensorValues(type: number): string;

  // Get data usage (ver. 1.44+, Android 6+)
  // Network data usage statistics

  /** Get total bytes received over mobile network */
  getAllRxBytesMobile(): number;

  /** Get total bytes transmitted over mobile network */
  getAllTxBytesMobile(): number;

  /** Get total bytes received over WiFi */
  getAllRxBytesWifi(): number;

  /** Get total bytes transmitted over WiFi */
  getAllTxBytesWifi(): number;

  ////// Control device, show notification, send network data etc.
  // Device control functions

  /** Turn device screen on */
  turnScreenOn(): void;

  /** Turn screen off, optionally keep app alive */
  turnScreenOff(keepAlive?: boolean): void;

  /** Force device to sleep immediately */
  forceSleep(): void;

  /** Show Android toast message */
  showToast(text: string): void;

  /** Set screen brightness (0-255) */
  setScreenBrightness(level: number): void;

  /** Enable WiFi (Android 10+ only with provisioned devices) */
  enableWifi(): void; // In Android 10+ only with provisioned devices

  /** Disable WiFi (Android 10+ only with provisioned devices) */
  disableWifi(): void; // In Android 10+ only with provisioned devices

  /** Enable Bluetooth */
  enableBluetooth(): void;

  /** Disable Bluetooth */
  disableBluetooth(): void;

  /** Show virtual keyboard */
  showKeyboard(): void;

  /** Hide virtual keyboard */
  hideKeyboard(): void;

  /** Open system WiFi settings */
  openWifiSettings(): void;

  /** Open system Bluetooth settings */
  openBluetoothSettings(): void;

  /** Vibrate device for specified milliseconds */
  vibrate(millis: number): void;

  /** Send hex data to TCP port */
  sendHexDataToTcpPort(hexData: string, host: string, port: number): void;

  /** Show system notification with optional URL action (ver. 1.33+) */
  showNotification(title: string, text: string, url: string, highPriority: boolean): void; // ver. 1.33+

  /** Write to Android log (ver. 1.41+) */
  log(type: number, tag: string, message: string): void; // ver. 1.41+

  // Access clipboard (ver. 1.40+)
  // Clipboard management
  // No access with Android 10+ if Fully is in background

  /** Copy text to system clipboard */
  copyTextToClipboard(text: string): void;

  /** Get plain text from clipboard */
  getClipboardText(): string;

  /** Get HTML text from clipboard */
  getClipboardHtmlText(): string;

  ////// Download and manage files
  // File system operations
  // Note that write access to external SD card is not supported

  /** Delete file at specified path */
  deleteFile(path: string): void;

  /** Read file content as string */
  readFile(path: string): string;

  /** Write content to file */
  writeFile(path: string, content: string): void;

  /** Delete folder recursively */
  deleteFolder(path: string): void; // recursive!

  /** Empty folder contents recursively (ver. 1.30+) */
  emptyFolder(path: string): void; // recursive, ver. 1.30+

  /** Create new folder (ver. 1.42+) */
  createFolder(path: string): void; // ver. 1.42+

  /** Get JSON array of files in folder (ver. 1.31+) */
  getFileList(folder: string): string; // get JSON array, ver. 1.31+

  /** Download file from URL to directory */
  downloadFile(url: string, dirName: string): void;

  /** Extract ZIP file (ver. 1.40.2+) */
  unzipFile(fileName: string): void; // ver. 1.40.2+

  /** Download and extract ZIP file */
  downloadAndUnzipFile(url: string, dirName: string): void;

  /** Execute shell command */
  runCommand(command: string): void;

  // ver. 1.36+ respond to download/unzip events
  // File operation events (ver. 1.36+) - Event callbacks for file operations

  /** Download completed successfully - params: $url,$dir,$code,$fileLength,$lastModified,$mimetype */
  bind(name: 'onDownloadSuccess', cb: string): void; // "$url","$dir","$code","$fileLength","$lastModified","$mimetype"

  /** Download failed - params: $url,$dir,$code */
  bind(name: 'onDownloadFailure', cb: string): void; // "$url","$dir","$code"

  /** Unzip completed successfully - params: $url,$dir */
  bind(name: 'onUnzipSuccess', cb: string): void; // "$url","$dir"

  /** Unzip failed - params: $url,$dir,$message */
  bind(name: 'onUnzipFailure', cb: string): void; // "$url","$dir","$message"

  ////// Use TTS, multimedia and PDF
  // Text-to-speech and media playback

  /** Speak text using default TTS settings */
  textToSpeech(text: string): void;

  /** Speak text with specific locale */
  textToSpeech(text: string, locale: string): void;

  /** Speak text with specific locale and TTS engine */
  textToSpeech(text: string, locale: string, engine: string): void;

  /** Speak text with full TTS options, queue parameter to add to speech queue (ver. 1.38+) */
  textToSpeech(text: string, locale: string, engine: string, queue: boolean): void; // ver. 1.38+

  /** Stop current TTS playback (ver. 1.38+) */
  stopTextToSpeech(): void; // ver. 1.38+

  /** Play video with specified options */
  playVideo(
    url: string,
    loop: boolean,
    showControls: boolean,
    exitOnTouch: boolean,
    exitOnCompletion: boolean
  ): void;

  /** Stop video playback (ver. 1.42+) */
  stopVideo(): void; // ver. 1.42+

  // Audio stream types for volume control:
  // stream :
  //   VoiceCall = 0,
  //   System = 1,
  //   Ring = 2,
  //   Music = 3,
  //   Alarm = 4,
  //   Notification = 5,
  //   Bluetooth = 6,
  //   DTMF = 8,
  //   TTS = 9,
  //   Accessibility = 10,

  /** Set volume level (0-100) for specific audio stream */
  setAudioVolume(level: number, stream: number): void;

  /** Play sound from URL with loop option */
  playSound(url: string, loop: boolean): void;

  /** Play sound on specific audio stream */
  playSound(url: string, loop: boolean, stream: number): void;

  /** Stop currently playing sound */
  stopSound(): void;

  /** Display PDF from URL in viewer */
  showPdf(url: string): void;

  /** Get current volume for specific audio stream */
  getAudioVolume(stream: number): number;

  /** Check if wired headset is connected (ver. 1.43+) */
  isWiredHeadsetOn(): boolean; // ver. 1.43+

  /** Check if music is currently playing (ver. 1.43+) */
  isMusicActive(): boolean; // ver. 1.43+

  ////// Control Fully and Browsing
  // Browser and app control functions

  /** Load the configured start URL */
  loadStartUrl(): void;

  /** Set action bar title text */
  setActionBarTitle(text: string): void;

  /** Start screensaver mode */
  startScreensaver(): void;

  /** Stop screensaver mode */
  stopScreensaver(): void;

  /** Start Android Daydream mode */
  startDaydream(): void;

  /** Stop Android Daydream mode */
  stopDaydream(): void;

  /** Add current page to home screen */
  addToHomeScreen(): void;

  /** Print current page (glb.print() doesn't work in kiosk) */
  print(): void; // glb.print() doesn't work

  /** Exit Fully Kiosk Browser app */
  exit(): void;

  /** Restart Fully Kiosk Browser app */
  restartApp(): void;

  /** Take screenshot and return as base64 PNG */
  getScreenshotPngBase64(): string;

  /** Get usage statistics as CSV string */
  loadStatsCSV(): string;

  /** Clear browser cache */
  clearCache(): void;

  /** Clear saved form data */
  clearFormData(): void;

  /** Clear browsing history */
  clearHistory(): void;

  /** Clear all cookies */
  clearCookies(): void;

  /** Clear cookies for specific URL (ver. 1.43.5+) */
  clearCookiesForUrl(url: string): void; // ver. 1.43.5+

  /** Clear web storage (localStorage, sessionStorage) */
  clearWebstorage(): void;

  /** Switch to next browser tab */
  focusNextTab(): void;

  /** Switch to previous browser tab */
  focusPrevTab(): void;

  /** Switch to tab by index */
  focusTabByIndex(index: number): void;

  /** Get index of current active tab */
  getCurrentTabIndex(): number;

  /** Share current URL using Android share dialog */
  shareUrl(): void;
  // 1.35+
  // Tab management functions (ver. 1.35+)

  /** Close tab at specified index */
  closeTabByIndex(index: number): void;

  /** Close current tab */
  closeThisTab(): void;

  /** Get list of all tabs as JSON array */
  getTabList(): string; // returns a JSON array

  /** Load URL in specific tab */
  loadUrlInTabByIndex(index: number, url: string): void;

  /** Load URL in new tab with optional focus */
  loadUrlInNewTab(url: string, focus: boolean): void;

  /** Get index of current tab */
  getThisTabIndex(): number;

  /** Get index of currently focused tab */
  getCurrentTabIndex(): number;

  /** Focus current tab */
  focusThisTab(): void;

  /** Focus tab by index */
  focusTabByIndex(index: number): void;

  ////// Barcode Scanner
  // Use $code placeholder in the resultUrl, see example below
  // for the scanned code
  // QR code and barcode scanning functionality

  /** Basic QR code scanning */
  scanQrCode(prompt: string, resultUrl: string): void;

  // Ver. 1.31+, enhanced interface
  // Use -1 for cameraId and timeout (in seconds) for defaults

  /** QR scan with camera selection, timeout, beep, and cancel options */
  scanQrCode(
    prompt: string,
    resultUrl: string,
    cameraId: number,
    timeout: number,
    beepEnabled: boolean,
    showCancelButton: boolean
  ): void;

  // Ver. 1.43.4+, activate flashlight if needed
  // Advanced QR scanning with flashlight (ver. 1.43.4+)

  /** QR scan with all options including flashlight control */
  scanQrCode(
    prompt: string,
    resultUrl: string,
    cameraId: number,
    timeout: number,
    beepEnabled: boolean,
    showCancelButton: boolean,
    useFlashlight: boolean
  ): void;

  // Ver. 1.31+, respond to QR events
  bind(name: 'onQrScanSuccess', cb: string): void; // $code
  // QR scanning events (ver. 1.31+)

  /** QR scan successful - param: $code */
  bind(name: 'onQrScanSuccess', cb: string): void;

  /** QR scan was cancelled by user */
  bind(name: 'onQrScanCancelled', cb: string): void;

  ////// Bluetooth Interface
  // Bluetooth device communication
  // Open BT connection
  // These functions are async, use events below to get results

  /** Open BT connection by MAC address */
  btOpenByMac(mac: string): boolean;

  /** Open BT connection by service UUID */
  btOpenByUuid(uuid: string): boolean;

  /** Open BT connection by device name */
  btOpenByName(name: string): boolean;

  // Get info and close connection
  // Bluetooth connection management

  /** Check if Bluetooth is connected */
  btIsConnected(): boolean;

  /** Get connected device info as JSON */
  btGetDeviceInfoJson(): string;

  /** Get list of paired devices as JSON */
  btGetDeviceListJson(): string;

  /** Close current Bluetooth connection */
  btClose(): void;

  // Send data
  // Bluetooth data transmission

  /** Send string data over Bluetooth */
  btSendStringData(stringData: string): boolean;

  /** Send hex-encoded data over Bluetooth */
  btSendHexData(hexData: string): boolean;

  /** Send byte array over Bluetooth */
  btSendByteData(data: number[]): boolean;

  // Respond to events
  // Bluetooth events

  /** BT connection successful - param: $device */
  bind(name: 'onBtConnectSuccess', cb: string): void; // $device

  /** BT connection failed */
  bind(name: 'onBtConnectFailure', cb: string): void;

  /** BT data received - param: $data */
  bind(name: 'onBtDataRead', cb: string): void; // $data

  ////// Read NFC Tags (ver. 1.45+)
  // NFC tag reading functionality

  /** Start NFC scanning with default settings */
  nfcScanStart(): boolean;

  /** Start NFC scanning with custom flags and debounce time */
  nfcScanStart(flags: number, debounceMs: number): boolean;

  /** Stop NFC scanning */
  nfcScanStop(): boolean;

  /** NDEF message discovered - params: $serial, $message, $data */
  bind(name: 'onNdefDiscovered', cb: string): void; // $serial, $message, $data

  /** NFC tag discovered - params: $serial, $type, $message, $data */
  bind(name: 'onNfcTagDiscovered', cb: string): void; // $serial, $type, $message, $data

  /** NFC tag removed - param: $serial (Android 7+) */
  bind(name: 'onNfcTagRemoved', cb: string): void; // $serial // Android 7+

  ////// Respond to Events
  // The second parameter is a containing: string JavaScript code to perform
  // Event binding for system and device events
  // The callback parameter contains JavaScript code to execute when event occurs

  /** Screen turned on */
  bind(name: 'screenOn', cb: string): void;

  /** Screen turned off */
  bind(name: 'screenOff', cb: string): void;

  /** Virtual keyboard shown */
  bind(name: 'showKeyboard', cb: string): void;

  /** Virtual keyboard hidden */
  bind(name: 'hideKeyboard', cb: string): void;

  /** Network disconnected */
  bind(name: 'networkDisconnect', cb: string): void;

  /** Network reconnected */
  bind(name: 'networkReconnect', cb: string): void;

  /** Internet disconnected */
  bind(name: 'internetDisconnect', cb: string): void;

  /** Internet reconnected */
  bind(name: 'internetReconnect', cb: string): void;

  /** Power disconnected */
  bind(name: 'unplugged', cb: string): void;

  /** AC power connected */
  bind(name: 'pluggedAC', cb: string): void;

  /** USB power connected */
  bind(name: 'pluggedUSB', cb: string): void;

  /** Wireless charging connected */
  bind(name: 'pluggedWireless', cb: string): void;

  /** Screensaver started */
  bind(name: 'onScreensaverStart', cb: string): void;

  /** Screensaver stopped */
  bind(name: 'onScreensaverStop', cb: string): void;

  /** Daydream started (ver. 1.39+) */
  bind(name: 'onDaydreamStart', cb: string): void; // ver. 1.39+

  /** Daydream stopped (ver. 1.39+) */
  bind(name: 'onDaydreamStop', cb: string): void; // ver. 1.39+

  /** Battery level changed */
  bind(name: 'onBatteryLevelChanged', cb: string): void;

  /** Volume up button pressed */
  bind(name: 'volumeUp', cb: string): void;

  /** Volume down button pressed */
  bind(name: 'volumeDown', cb: string): void;

  /** Motion detected (max once per second) */
  bind(name: 'onMotion', cb: string): void; // Max. one per second

  /** Faces detected - param: $number (ver. 1.48+) */
  bind(name: 'facesDetected', cb: string): void; // $number // 1.48+

  /** Darkness detected (requires screen off on darkness setting) */
  bind(name: 'onDarkness', cb: string): void; // Requires screen off on darkness

  /** Device movement detected */
  bind(name: 'onMovement', cb: string): void;

  /** iBeacon detected - params: $id1, $id2, $id3, $distance */
  bind(name: 'onIBeacon', cb: string): void; // $id1, $id2, $id3, $distance

  /** Android broadcast received - params: $action, $extras (ver. 1.40.2+) */
  bind(name: 'broadcastReceived', cb: string): void; // $action, $extras // 1.40.2+

  /** QR scan successful - params: $code, $extras */
  bind(name: 'onQrScanSuccess', cb: string): void; // $code, $extras

  ////// Manage Apps, Activities, Intents etc.
  // Android app and intent management

  /** Start app by package name */
  startApplication(packageName: string): void;

  /** Start app with action and URL (can use null for parameters in ver. 1.33+) */
  startApplication(packageName: string, action: string, url: string): void; // Can put null to omit the parameter in ver. 1.33+

  /** Start intent with URL */
  startIntent(url: string): void;

  /** Send broadcast intent (ver. 1.31+) */
  broadcastIntent(url: string): void; // ver. 1.31+

  /** Check if Fully is in foreground */
  isInForeground(): boolean;

  /** Bring Fully to foreground */
  bringToForeground(): void;

  /** Bring Fully to foreground with delay in milliseconds */
  bringToForeground(millis: number): void; // Delay in ms

  /** Send Fully to background (ver. 1.31+) */
  bringToBackground(): void; // ver. 1.31+

  /** Install APK file from URL (ver. 1.36+) */
  installApkFile(url: string): void; // ver. 1.36+

  /** Enable maintenance mode (ver. 1.39+) */
  enableMaintenanceMode(): void; // ver. 1.39+

  /** Disable maintenance mode (ver. 1.39+) */
  disableMaintenanceMode(): void; // ver. 1.39+

  /** Show overlay message (ver. 1.39+) */
  setMessageOverlay(text: string): void; // ver. 1.39+

  /** Register for broadcast events (ver. 1.40.2+) */
  registerBroadcastReceiver(action: string): void; // ver. 1.40.2+

  /** Unregister from broadcast events (ver. 1.40.2+) */
  unregisterBroadcastReceiver(action: string): void; // ver. 1.40.2+

  ////// Motion Detection
  // Camera-based motion and face detection

  /** Start motion detection using camera */
  startMotionDetection(): void;

  /** Stop motion detection */
  stopMotionDetection(): void;

  /** Check if motion detection is active */
  isMotionDetectionRunning(): boolean;

  /** Take camera photo and return as base64 JPEG */
  getCamshotJpgBase64(): string;

  /** Get number of detected faces (ver. 1.48+) */
  getFaceNumber(): number; // 1.48+

  /** Manually trigger motion event */
  triggerMotion(): void;

  /** Motion detected event (max once per second) */
  bind(name: 'onMotion', cb: string): void; // Triggered max. once per second

  ////// Manage all Fully settings
  // Configuration management

  /** Get configured start URL */
  getStartUrl(): string;

  /** Set start URL */
  setStartUrl(url: string): void;

  // Settings management
  // Look in Remote Admin settings for the settings keys

  /** Get boolean setting value */
  getBooleanSetting(key: FullyBooleanSettings): 'true' | 'false';

  /** Get string/number setting value */
  getStringSetting(key: FullyStringSettings | FullyNumberStringSettings): string;
  // getStringSetting(key: FullyNumberSettings): number;
  // Get numeric setting (alternative signature)

  // Settings modification
  // Changes apply immediately

  /** Set boolean setting */
  setBooleanSetting(key: FullyBooleanSettings, value: boolean): void;

  /** Set string/number setting */
  setStringSetting(key: FullyStringSettings | FullyNumberStringSettings, value: string): void;
  // setStringSetting(key: FullyNumberSettings, value: number): void;
  // Set numeric setting (alternative signature)

  /** Import settings from URL (ver. 1.36+) */
  importSettingsFile(url: string): void; // ver. 1.36+

  ////// Private
  // Internal functions - Advanced system control (use with caution)
  // TODO Missing REST API functions that might be available:

  /** Get device owner information*/
  getDeviceOwner(): string;

  /** Get CPU usage percentage */
  getCpuUsage(): number;

  /** Get RAM usage information */
  getRamUsage(): number;

  /** Get device temperature */
  getTemperature(): number;

  /** Check if device is rooted */
  isDeviceRooted(): boolean;

  /** Get list of installed apps as JSON */
  getInstalledApps(): string;

  /** Uninstall app by package name */
  uninstallApp(packageName: string): void;

  /** Set WiFi credentials */
  setWifiCredentials(ssid: string, password: string): void;

  /** Connect to specific WiFi network */
  connectToWifi(ssid: string): void;

  /** Get device uptime in milliseconds */
  getDeviceUptime(): number;

  /** Lock device immediately */
  lockDevice(): void;

  /** Unlock device */
  unlockDevice(): void;

  /** Take photo and return base64 */
  takePhoto(): string;

  /** Record video for duration */
  recordVideo(duration: number): string;

  /** Get GPS coordinates as JSON */
  getGpsLocation(): string;

  /** Enable location services */
  enableLocation(): void;

  /** Disable location services */
  disableLocation(): void;

  /** Get mobile network info as JSON */
  getMobileNetworkInfo(): string;

  /** Set device name */
  setDeviceName(name: string): void;

  /** Get app usage statistics */
  getDeviceUsageStats(): string;

  /** Clear app data */
  clearAppData(packageName: string): void;

  /** Force stop app */
  forceStopApp(packageName: string): void;

  /** Set system time */
  setSystemTime(timestamp: number): void;

  /** Get system logs */
  getSystemLogs(): string;

  /** Execute command as root */
  executeRootCommand(command: string): string;

  /** Control airplane mode */
  setAirplaneMode(enabled: boolean): void;

  /** Control mobile data */
  setDataConnection(enabled: boolean): void;

  /** Open BT by MAC and UUID */
  btOpenByMacAndUuid: () => void;

  /** Open BT by name and UUID */
  btOpenByNameAndUuid: () => void;

  /** Check if intent can be resolved */
  canResolveIntent: () => void;

  /** Force crash for testing */
  crashMe: () => void;

  /** Get battery temperature */
  getBatteryTemperature: () => void;

  /** Get device owner serial */
  getSerialNumberDeviceOwner: () => void;

  /** Get WebView provider info */
  getWebviewProvider: () => void;

  /** Get WebView user agent */
  getWebviewUa: () => void;

  /** Initialize text-to-speech */
  initTts: () => void;

  /** Check if in daydream mode */
  isInDaydream: () => void;

  /** Check if in screensaver mode */
  isInScreensaver: () => void;

  /** Check if mobile data enabled */
  isMobileDataEnabled: () => void;

  /** Check WebSocket connection */
  isWssConnected: () => void;

  /** Kill background processes */
  killBackgroundProcesses: () => void;

  /** Lock kiosk mode */
  lockKiosk: () => void;

  /** Media player next */
  playerNext: () => void;

  /** Media player pause */
  playerPause: () => void;

  /** Media player resume */
  playerResume: () => void;

  /** Media player start */
  playerStart: () => void;

  /** Media player stop */
  playerStop: () => void;

  /** Reboot device */
  reboot: () => void;

  /** Reboot to recovery mode */
  rebootRecovery: () => void;

  /** Request window focus */
  requestFocus: () => void;

  /** Restore original brightness */
  restoreScreenBrightness: () => void;

  /** Resume application */
  resume: () => void;

  /** Send WebSocket message */
  sendWssMessage: () => void;

  /** Set overlay message */
  setOverlayMessage: (message: string) => void;

  /** Shutdown device */
  shutdown: () => void;

  /** Trigger pending events */
  triggerPendingEvents: () => void;

  /** Unlock kiosk mode */
  unlockKiosk: () => void;
  /** Get raw boolean setting */
  getBooleanRawSetting: () => void;

  /** Get raw string setting */
  getStringRawSetting: () => void;

  /** Get global int setting */
  getSettingsGlobalInt: () => void;

  /** Get global long setting */
  getSettingsGlobalLong: () => void;

  /** Get global string setting */
  getSettingsGlobalString: () => void;

  /** Get raw setting keys */
  getRawSettingKeys: () => void;

  /** Set raw string setting */
  setStringRawSetting: () => void;

  /** Set raw boolean setting */
  setBooleanRawSetting: () => void;

  /** Remove raw setting */
  removeRawSetting: () => void;

  /** Put global int setting */
  putSettingsGlobalInt: () => void;

  /** Put global long setting */
  putSettingsGlobalLong: () => void;

  /** Put global string setting */
  putSettingsGlobalString: () => void;
}

export type FullyBooleanSettings =
  | 'mdmDisableVolumeButtons' // false,
  | 'playMedia' // false,
  | 'deleteHistoryOnReload' // false,
  | 'mdmDisableADB' // true,
  | 'movementWhenUnplugged' // false,
  | 'showActionBar' // false,
  | 'mdmDisableScreenCapture' // false,
  | 'restartOnCrash' // true,
  | 'deleteWebstorageOnReload' // false,
  | 'forceDeviceAdmin' // false,
  | 'kioskMode' // false,
  | 'showStatusBar' // false,
  | 'knoxDisableAndroidBeam' // false,
  | 'removeNavigationBar' // false,
  | 'softKeyboard' // true,
  | 'knoxDisableSettingsChanges' // false,
  | 'kioskHomeStartURL' // false,
  | 'knoxDisableSDCardWrite' // false,
  | 'launchOnBoot' // false,
  | 'movementStopsSleepOnPowerDisconnect' // false,
  | 'knoxDisableUsbHostStorage' // false,
  | 'inUseWhileAudioPlaying' // false,
  | 'resendFormData' // false,
  | 'clearCacheEach' // false,
  | 'sleepOnPowerConnect' // false,
  | 'knoxDisableWiFi' // false,
  | 'knoxDisableAirViewMode' // false,
  | 'pauseMotionInBackground' // false,
  | 'rootEnable' // false,
  | 'resetZoomEach' // false,
  | 'showHomeButton' // true,
  | 'waitInternetOnReload' // true,
  | 'knoxDisableWifiTethering' // false,
  | 'knoxDisableBluetooth' // false,
  | 'inUseWhileAnotherAppInForeground' // false,
  | 'knoxDisableGoogleCrashReport' // false,
  | 'geoLocationAccess' // false,
  | 'knoxDisableVideoRecord' // false,
  | 'enableUrlOtherApps' // false,
  | 'showNavigationBar' // false,
  | 'loadCurrentPageOnReload' // false,
  | 'killOtherApps' // false,
  | 'loadOverview' // false,
  | 'remoteAdminScreenshot' // true,
  | 'screenOnOnMotion' // true,
  | 'useWideViewport' // true,
  | 'enableTapSound' // false,
  | 'movementDetection' // false,
  | 'formAutoComplete' // true,
  | 'webHostFilter' // false,
  | 'screenOffOnPowerConnect' // false,
  | 'advancedKioskProtection' // true,
  | 'mdmLockTaskGlobalActions' // true,
  | 'swipeTabs' // false,
  | 'webcamAccess' // false,
  | 'enableQrScan' // false,
  | 'knoxDisableClipboard' // false,
  | 'cloudService' // false,
  | 'motionDetection' // false,
  | 'resumeVideoAudio' // true,
  | 'inUseWhileKeyboardVisible' // false,
  | 'remoteAdminCamshot' // true,
  | 'reloadOnScreensaverStop' // false,
  | 'forceSleepIfUnplugged' // false,
  | 'actionBarInSettings' // false,
  | 'enablePopups' // false,
  | 'screensaverOtherApp' // false,
  | 'recreateTabsOnReload' // false,
  | 'mdmDisableKeyguard' // false,
  | 'forceScreenOrientationGlobal' // false,
  | 'knoxHideStatusBar' // false,
  | 'knoxDisableDeveloperMode' // false,
  | 'showAddressBar' // false,
  | 'remoteAdminLan' // true,
  | 'knoxDisableTaskManager' // false,
  | 'knoxEnabled' // false,
  | 'knoxDisableBackup' // false,
  | 'mdmLockTaskOverviewButton' // false,
  | 'disableIncomingCalls' // false,
  | 'knoxDisableEdgeScreen' // false,
  | 'forceHideKeyboard' // false,
  | 'disableNotifications' // false,
  | 'disableOtherApps' // true,
  | 'mdmDisableSafeModeBoot' // true,
  | 'remoteAdminFileManagement' // false,
  | 'knoxDisableMtp' // false,
  | 'textSelection' // false,
  | 'websiteIntegration' // true,
  | 'knoxDisableCellularData' // false,
  | 'proximityScreenOff' // false,
  | 'videoCaptureUploads' // false,
  | 'reloadOnInternet' // false,
  | 'enableLocalhost' // false,
  | 'usageStatistics' // false,
  | 'isRunning' // true,
  | 'resetWifiOnDisconnection' // false,
  | 'fileUploads' // false,
  | 'detectMotionOnlyWithFaces' // false,
  | 'singleAppMode' // false,
  | 'forceImmersive' // false,
  | 'knoxDisableScreenCapture' // false,
  | 'removeStatusBar' // false,
  | 'knoxDisableWifiDirect' // false,
  | 'knoxHideNavigationBar' // false,
  | 'mdmDisableStatusBar' // false,
  | 'showShareButton' // false,
  | 'knoxDisableMultiUser' // false,
  | 'redirectBlocked' // false,
  | 'forceSwipeUnlock' // false,
  | 'jsAlerts' // true,
  | 'detectFaces' // false,
  | 'screensaverDaydream' // false,
  | 'mdmDisableUsbStorage' // false,
  | 'knoxDisableFactoryReset' // false,
  | 'lockSafeMode' // false,
  | 'keepOnWhileFullscreen' // true,
  | 'reloadOnScreenOn' // false,
  | 'safeBrowsing' // false,
  | 'deleteCookiesOnReload' // false,
  | 'sleepOnPowerDisconnect' // false,
  | 'knoxDisableFirmwareRecovery' // false,
  | 'knoxDisableVpn' // false,
  | 'runInForeground' // true,
  | 'screenOnOnMovement' // true,
  | 'barcodeScanInsertInputField' // false,
  | 'knoxDisableHomeButton' // false,
  | 'knoxDisableStatusBar' // false,
  | 'knoxDisableHeadphoneState' // false,
  | 'protectedContent' // false,
  | 'knoxSetForceAutoStartUpState' // false,
  | 'enableZoom' // true,
  | 'playerCacheImages' // true,
  | 'detectIBeacons' // false,
  | 'mdmDisableAppsFromUnknownSources' // true,
  | 'barcodeScanListenKeys' // false,
  | 'deleteCacheOnReload' // false,
  | 'stopScreensaverOnMovement' // true,
  | 'knoxDisableOtaUpgrades' // false,
  | 'showQrScanButton' // false,
  | 'motionDetectionAcoustic' // false,
  | 'stopScreensaverOnMotion' // true,
  | 'audioRecordUploads' // false,
  | 'showAppLauncherOnStart' // false,
  | 'mdmLockTaskNotifications' // false,
  | 'disableScreenshots' // false,
  | 'knoxDisableSafeMode' // false,
  | 'ignoreMotionWhenScreensaverOnOff' // false,
  | 'knoxDisableGoogleAccountsAutoSync' // false,
  | 'knoxDisableAudioRecord' // false,
  | 'showRefreshButton' // false,
  | 'knoxDisableVolumeButtons' // false,
  | 'autoImportSettings' // true,
  | 'showForwardButton' // true,
  | 'mqttEnabled' // false,
  | 'knoxDisablePowerSavingMode' // false,
  | 'keepSleepingIfUnplugged' // false,
  | 'knoxDisableUsbDebugging' // false,
  | 'disableVolumeButtons' // true,
  | 'environmentSensorsEnabled' // false,
  | 'showNewTabButton' // false,
  | 'showBackButton' // true,
  | 'stopIdleReloadOnMotion' // false,
  | 'enableBackButton' // true,
  | 'ignoreSSLerrors' // false,
  | 'webviewDebugging' // false,
  | 'disableStatusBar' // true,
  | 'confirmExit' // true,
  | 'showProgressBar' // true,
  | 'knoxDisableRecentTaskButton' // false,
  | 'knoxDisableClipboardShare' // false,
  | 'knoxDisableBluetoothTethering' // false,
  | 'phoneSpeaker' // false,
  | 'setWifiWakelock' // false,
  | 'disableOutgoingCalls' // false,
  | 'screenOffInDarkness' // false,
  | 'knoxDisableAirplaneMode' // false,
  | 'enablePullToRefresh' // false,
  | 'touchInteraction' // true,
  | 'enableFullscreenVideos' // true,
  | 'showTabCloseButtons' // true,
  | 'showMenuHint' // true,
  | 'keepScreenOnAdvanced' // false,
  | 'disableHomeButton' // true,
  | 'renderInCutoutArea' // true,
  | 'pauseWebviewOnPause' // false,
  | 'touchesOtherAppsBreakIdle' // false,
  | 'thirdPartyCookies' // true,
  | 'showPrintButton' // false,
  | 'mdmLockTaskSystemInfo' // false,
  | 'keepScreenOn' // true,
  | 'knoxDisableMultiWindowMode' // false,
  | 'forceShowKeyboard' // false,
  | 'disableCamera' // false,
  | 'showCamPreview' // false,
  | 'addXffHeader' // false,
  | 'remoteAdmin' // false,
  | 'mdmLockTaskHomeButton' // false,
  | 'webviewDragging' // true,
  | 'forceScreenUnlock' // true,
  | 'enableVersionInfo' // true,
  | 'knoxDisableMicrophoneState' // false,
  | 'knoxDisableUsbTethering' // false,
  | 'knoxDisableAirCommandMode' // false,
  | 'reloadOnWifiOn' // false,
  | 'webviewScrolling' // true,
  | 'knoxDisableBackButton' // false,
  | 'knoxActiveByKiosk' // false,
  | 'playAlarmSoundOnMovement' // false,
  | 'barcodeScanSubmitInputField' // false,
  | 'addRefererHeader' // true,
  | 'remoteAdminSingleAppExit' // false,
  | 'disablePowerButton' // true,
  | 'showTabs' // false,
  | 'microphoneAccess' // false,
  | 'pageTransitions' // false,
  | 'restartAfterUpdate' // true,
  | 'swipeNavigation' // false,
  | 'skipReloadIfStartUrlShowing' // false,
  | 'knoxDisablePowerOff' // false,
  | 'setRemoveSystemUI' // false,
  | 'ignoreMotionWhenMoving' // false,
  | 'setCpuWakelock' // false,
  | 'playAlarmSoundUntilPin' // false,
  | 'knoxDisableCamera' // false,
  | 'desktopMode' // true,
  | 'cameraCaptureUploads' // false,
  | 'wakeupOnPowerConnect' // false,
  | 'autoplayAudio' // false,
  | 'autoplayVideos' // true,
  | 'knoxDisableNonMarketApps' // false,
  | 'unlockAndroidTvPrefs' // false,
  | 'preventSleepWhileScreenOff' // false,
  | 'mdmLockTask' // false,
  | 'knoxDisablePowerButton' // false,
  | 'readNfcTag'; // false,

export type FullyStringSettings =
  | '_isDev'
  | '_custom'
  | '_injectJsModified'
  | 'wifiSSID' // "",
  | 'actionBarBgUrl' // "",
  | 'mdmApkToInstall' // "",
  | 'mqttDeviceInfoTopic' // "$appId/deviceInfo/$deviceId",
  | 'screensaverBrightness' // "",
  | 'mqttBrokerUrl' // "",
  | 'kioskAppWhitelist' // "",
  | 'authPassword' // "",
  | 'mqttBrokerPassword' // "",
  | 'motionCameraId' // "",
  | 'mqttClientId' // "",
  | 'barcodeScanTargetUrl' // "",
  | 'lastVersionInfo' // "1.48.1-play",
  | 'clientCaPassword' // "",
  | 'screensaverPlaylist' // "",
  | 'screenBrightness' // "",
  | 'urlWhitelist' // "",
  | 'launcherInjectCode' // "",
  | 'wssServiceUrl' // "",
  | 'barcodeScanIntent' // "",
  | 'deviceName' // "",
  | 'wifiEnterprisePassword' // "",
  | 'screensaverWallpaperURL' // "fully://color#000000",
  | 'alarmSoundFileUrl' // "",
  | 'mqttEventTopic' // "$appId/event/$event/$deviceId",
  | 'folderCleanupTime' // "",
  | 'launcherApps' // "",
  | 'mdmSystemAppsToEnable' // "",
  | 'folderCleanupList' // "",
  | 'kioskWifiPin' // "",
  | 'kioskAppBlacklist' // "",
  | 'wifiKey' // "",
  | 'barcodeScanBroadcastExtra' // "",
  | 'loadContentZipFileUrl' // "",
  | 'mqttBrokerUsername' // "",
  | 'knoxApnConfig' // "",
  | 'mainWebAutomation' // "",
  | 'screensaverOtherAppIntent' // "",
  | 'clientCaUrl' // "",
  | 'forceOpenByAppUrl' // "",
  | 'mdmAppLockTaskWhitelist' // "",
  | 'volumeLevels' // "",
  | 'appToRunOnStart' // "",
  | 'killAppsBeforeStartingList' // "",
  | 'injectJsCode' // "",
  | 'errorURL' // "",
  | 'authUsername' // "",
  | 'volumeLimits' // "",
  | 'singleAppIntent' // "",
  | 'urlBlacklist' // "",
  | 'remoteAdminPassword' // "",
  | 'customUserAgent' // "",
  | 'actionBarCustomButtonUrl' // "",
  | 'appBlockReturnIntent' // "",
  | 'movementBeaconList' // "",
  | 'mdmApnConfig' // "",
  | 'mdmProxyConfig' // "",
  | 'volumeLicenseKey' // "",
  | 'barcodeScanBroadcastAction' // "",
  | 'mdmAppsToDisable' // "",
  | 'appToRunInForegroundOnStart' // "",
  | 'sleepSchedule' // "",
  | 'rebootTime' // "",
  | 'actionBarTitle' // "Fully Kiosk Browser",
  | 'actionBarIconUrl' // "",
  | 'wifiEnterpriseIdentity' // "",
  | 'kioskWifiPinCustomIntent' // "",
  | 'startURL' // "https://kiosk-viewer.web.app",
  | 'sebExamKey' // "",
  | 'launcherBgUrl' // "",
  | 'searchProviderUrl' // "https://www.google.com/search?q=",
  | 'sebConfigKey' // "",
  | 'wifiType' // "WPA_PSK",
  | 'kioskPinEnc'; // : "enc_g97sIMNsKiqcokN6+7AgR0o9wp7LSc9lGDaDQyZURDU="

export type FullyNumberStringSettings =
  | 'errorUrlOnDisconnection' // "0",
  | 'imageScaleType' // "3",
  | 'kioskWifiPinAction' // "0",
  | 'mdmPasswordQuality' // "0",
  | 'wifiMode' // "0",
  | 'timeToScreenOffV2' // "0",
  | 'forceScreenOrientation' // "0",
  | 'timeToRegainFocus' // "0",
  | 'initialScale' // "0",
  | 'kioskExitGesture' // "0",
  | 'bluetoothMode' // "0",
  | 'timeToGoBackground' // "0",
  | 'timeToClearSingleAppData' // "0",
  | 'timeToShutdownOnPowerDisconnect' // "0",
  | 'reloadPageFailure' // "0",
  | 'cacheMode' // "-1",
  | 'compassSensitivity' // "50",
  | 'motionFps' // "5",
  | 'sleepOnPowerDisconnectDelay' // "0",
  | 'reloadEachSeconds' // "0",
  | 'webviewDarkMode' // "1",
  | 'batteryWarning' // "0",
  | 'graphicsAccelerationMode' // "2",
  | 'appLauncherScaling' // "100",
  | 'motionSensitivity' // "90",
  | 'accelerometerSensitivity' // "80",
  | 'remoteFileMode' // "0",
  | 'mdmMinimumPasswordLength' // "5",
  | 'mdmApkToInstallInterval' // "0",
  | 'fontSize' // "100",
  | 'timeToClearLauncherAppData' // "0",
  | 'actionBarSize' // "100",
  | 'motionSensitivityAcoustic' // "90",
  | 'userAgent' // "0",
  | 'webviewMixedContent' // "2",
  | 'remotePdfFileMode' // "0",
  | 'mdmSystemUpdatePolicy' // "0",
  | 'localPdfFileMode' // "0",
  | 'mdmRuntimePermissionPolicy' // "0",
  | 'fadeInOutDuration' // "200",
  | 'displayMode' // "0",
  | 'tapsToPinDialogInSingleAppMode' // "7",
  | 'timeToScreensaverV2' // "0",
  | 'movementBeaconDistance' // "5",
  | 'darknessLevel'; // "10",

export type FullyNumberSettings =
  | 'actionBarFgColor' // -1
  | 'tabsBgColor' // -2236963
  | 'progressBarColor' // -13611010
  | 'addressBarBgColor' // -2236963
  | 'statusBarColor' // 0
  | 'appLauncherBackgroundColor' // -1
  | 'defaultWebviewBackgroundColor' // -1
  | 'inactiveTabsBgColor' // -4144960
  | 'navigationBarColor' // 0
  | 'appLauncherTextColor' // -16777216
  | 'actionBarBgColor' // -15906911
  | 'tabsFgColor'; // -16777216
