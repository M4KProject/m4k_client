import { newProgressDialog } from '@/components/kiosk/ProgressView';
import { bridge, BridgeFileInfo } from '@/bridge';
import { logger, sleep, jsonStringify, toError } from 'fluxio';
import { getKProp, kPlaylist$ } from './Kiosk';

const log = logger('copyPlaylist');

const PLAYLIST_DIR = 'playlist';

const copyPlaylist = async () => {
  if (!bridge) return;

  const copyDirName = getKProp('copyDir') || 'playlist';
  const copyDir = `@storage/${copyDirName}`;
  const copyDirInfo = await bridge.fileInfo(copyDir);
  if (copyDirInfo.type !== 'dir') return;

  await sleep(2000);

  const getType = (fileName: string) => {
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    return (
      {
        zip: 'zip',
        pdf: 'pdf',
        png: 'image',
        jpg: 'image',
        jpeg: 'image',
        mov: 'video',
        mp4: 'video',
        mkv: 'video',
        webm: 'video',
      }[ext] || ''
    );
  };

  const newFilesProcess = async (
    dir: string,
    title: string,
    filter: (fileName: string, type: string) => boolean,
    before: null | ((files: string[]) => Promise<void>),
    process: (path: string, fileName: string) => Promise<void>
  ) => {
    const files = await bridge.ls(dir);
    const filteredFiles = files.filter((f) => filter(f, getType(f)));
    const len = filteredFiles.length;
    if (len === 0) return;

    const prog = newProgressDialog(`${title} (${len})`);

    if (before) await before(filteredFiles);

    for (let i = 0; i < filteredFiles.length; i++) {
      const step = i / filteredFiles.length;
      const fileName = filteredFiles[i];

      try {
        const path = `${dir}/${fileName}`;
        prog(step, 'info', `Traitement "${fileName}"`);
        await process(path, fileName!);
      } catch (e) {
        const error = toError(e);
        log.e(`playlistFilter "${fileName}" : ${error}`);
        prog(step, 'error', `Erreur "${fileName}" : ${error}`);
        await sleep(4000);
      }
    }

    prog(1, 'info', `OK`);

    await sleep(5000);
  };

  let sourceFilesCount = 0;
  await newFilesProcess(
    copyDir,
    `Copie des fichiers`,
    (fileName, type) => fileName[0] !== '.' && !!type,
    async (files) => {
      sourceFilesCount = files.length;
      await bridge.rm(PLAYLIST_DIR);
      await bridge.mkdir(PLAYLIST_DIR);
    },
    async (filePath, fileName) => {
      log.d('cp', filePath, `${PLAYLIST_DIR}/${fileName}`);
      await bridge.cp(filePath, `${PLAYLIST_DIR}/${fileName}`);
    }
  );
  if (sourceFilesCount === 0) return;

  await newFilesProcess(
    PLAYLIST_DIR,
    `Decompression des fichiers ZIP`,
    (_, type) => type === 'zip',
    null,
    async (path) => {
      log.d('unzip', path);
      await bridge.unzip(path);
      await bridge.rm(path);
    }
  );

  await newFilesProcess(
    PLAYLIST_DIR,
    `Exécution de script`,
    (fileName) => fileName.endsWith('update.js'),
    null,
    async (path) => {
      log.d('loadJs', path);
      const result = await bridge.loadJs(path);
      log.i('Script execution result:', jsonStringify(result));
      await bridge.rm(path);
      if (!result.success) {
        throw new Error(`Script failed with code ${result.error}`);
      }
    }
  );

  await newFilesProcess(
    PLAYLIST_DIR,
    `Installation d'application`,
    (_, type) => type === 'apk',
    null,
    async (path) => {
      log.d('installApk', path);
      await bridge.installApk(path);
      await bridge.rm(path);
    }
  );

  await newFilesProcess(
    PLAYLIST_DIR,
    `Convertion PDF en images`,
    (_, type) => type === 'pdf',
    null,
    async (path) => {
      log.d('pdf', path);
      await bridge.pdfToImages(path);
      await bridge.rm(path);
    }
  );

  await newFilesProcess(
    PLAYLIST_DIR,
    `Compression des images`,
    (_, type) => type === 'image',
    null,
    async (path) => {
      const sourcePath = await bridge.absolutePath(path);
      const resizedPath = await bridge.resize(sourcePath);
      log.d('resized', sourcePath, resizedPath);
      if (sourcePath !== resizedPath) {
        await bridge.rm(sourcePath);
      }
    }
  );

  const items: BridgeFileInfo[] = [];
  await newFilesProcess(
    PLAYLIST_DIR,
    `Création de la playlist`,
    (_, type) => type === 'image' || type === 'video',
    null,
    async (path) => {
      const info = await bridge.fileInfo(path);
      log.d('info', info);
      items.push(info);
    }
  );

  log.d('playlist items', items);
  kPlaylist$.set({ items })

  // Wait for localStorage persistence
  await sleep(5000);

  await bridge.restart();
};

export default copyPlaylist;
