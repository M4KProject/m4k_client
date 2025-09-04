import { newProgressDialog } from "./components/ProgressView"
import { m4k } from "@common/m4k"
import { parse, sleep, stringify } from "@common/helpers"
import { M4kFileInfo } from "@common/m4k/m4kInterface"
import { playlist$ } from "./messages"
import { getStored } from "@common/helpers/storage"

const PLAYLIST_DIR = 'playlist'

const copyPlaylist = async (fromDir: string) => {
  if (!m4k) return;

  const fromDirInfo = await m4k.fileInfo(fromDir)
  if (fromDirInfo.type !== 'dir') return

  await sleep(2000)

  const getType = (fileName: string) => {
    const ext = (fileName.split('.').pop()||'').toLowerCase()
    return {
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
  }

  const newFilesProcess = async (
    dir: string,
    title: string,
    filter: (fileName: string, type: string) => boolean,
    before: null|((files: string[]) => Promise<void>),
    process: (path: string, fileName: string) => Promise<void>,
  ) => {
    const files = await m4k.ls(dir)
    const filteredFiles = files.filter(f => filter(f, getType(f)))
    const len = filteredFiles.length

    const prog = newProgressDialog(`${title} (${len})`)

    if (before) before(filteredFiles)

    for (let i=0; i<filteredFiles.length; i++) {
      const step = i / filteredFiles.length
      const fileName = filteredFiles[i]

      try {
        const path = `${dir}/${fileName}`
        prog(step, 'info', `Traitement "${fileName}"`)
        await process(path, fileName)
      }
      catch (error) {
        console.error(`playlistFilter "${fileName}" : ${error}`)
        prog(step, 'error', `Erreur "${fileName}" : ${error}`)
        await sleep(4000)
      }
    }

    if (len > 0) {
      prog(1, 'info', `Traitement des fichiers terminée`)
    }
    else {
      prog(1, 'info', `Aucun fichier`)
    }

    await sleep(1000)
  }

  let sourceFilesCount = 0
  await newFilesProcess(
    fromDir,
    `Copie des fichiers`,
    (fileName, type) => fileName[0] !== '.' && !!type,
    async (files) => {
      sourceFilesCount = files.length
      await m4k.rm(PLAYLIST_DIR)
      await m4k.mkdir(PLAYLIST_DIR)
    },
    async (filePath, fileName) => {
      await m4k.cp(filePath, `${PLAYLIST_DIR}/${fileName}`)
    },
  )
  if (sourceFilesCount === 0) return

  await newFilesProcess(
    PLAYLIST_DIR,
    `Decompression des fichiers ZIP`,
    (_, type) => type === 'zip',
    null,
    async (path) => {
      await m4k.unzip(path)
      await m4k.rm(path)
    }
  )

  await newFilesProcess(
    PLAYLIST_DIR,
    `Convertion des fichiers PDF en images`,
    (_, type) => type === 'pdf',
    null,
    async (path) => {
      await m4k.pdfToImages(path)
      await m4k.rm(path)
    }
  )

  await newFilesProcess(
    PLAYLIST_DIR,
    `Compression des images`,
    (_, type) => type === 'image',
    null,
    async (path) => {
      const sourcePath = await m4k.absolutePath(path)
      const resizedPath = await m4k.resize(sourcePath)
      if (sourcePath !== resizedPath) {
        await m4k.rm(sourcePath)
      }
    }
  )

  await newFilesProcess(
    PLAYLIST_DIR,
    `Compression des vidéos`,
    (_, type) => type === 'video',
    null,
    async (path) => {
      const sourcePath = await m4k.absolutePath(path)
      
      const ffprobeCmd = `ffprobe -v quiet -print_format json -show_format -show_streams -i "${sourcePath}"`;
      console.debug('video ffprobe cmd: ' + ffprobeCmd);

      // Get video metadata with ffprobe
      const probeResult = await m4k.su(ffprobeCmd);
      console.debug('video ffprobe result: ' + stringify(probeResult));
      
      const { streams, format } = parse(probeResult.out || '{}')
      if (!streams || !format) return
      
      const v = streams.find(s => s.codec_type === 'video') || {}
      const width = parseInt(v.width) || 0
      const height = parseInt(v.height) || 0
      const bytes = parseInt(format.size) || 0
      
      console.debug(`video ffprobe width:${width} ${height} ${bytes}`);
      
      // Only compress if video is large or high resolution
      if (bytes > 50 * 1024 * 1024 || width > 1920 || height > 1920) {
        const compressedPath = sourcePath.replace(/\.[^.]+$/, '_compressed.mp4')
        
        const ffmpegCmd = `ffmpeg -y -loglevel info -i "${sourcePath}" -c:v libx264 -c:a aac -preset fast -crf 23 -vf "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease:eval=frame" -movflags +faststart -pix_fmt yuv420p -f mp4 ${compressedPath}`;
        console.debug('video ffmpeg cmd: ' + ffmpegCmd);

        const ffmpegResult = await m4k.su(ffmpegCmd);
        console.debug('video ffmpeg result: ' + stringify(ffmpegResult));
        
        await m4k.rm(sourcePath)
        await m4k.mv(compressedPath, sourcePath)
      }
    }
  )

  const items: M4kFileInfo[] = []
  await newFilesProcess(
    PLAYLIST_DIR,
    `Création de la playlist`,
    (_, type) => type === 'image' || type === 'video',
    null,
    async (path) => {
      const info = await m4k.fileInfo(path)
      items.push(info)
    }
  )

  console.debug('playlist items', items)
  playlist$.set({ items });
  
  // Wait for localStorage persistence
  await sleep(5000);

  await m4k.restart();
}

export default copyPlaylist