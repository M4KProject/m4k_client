import { newProgressDialog } from "./components/ProgressView"
import { m4k } from "@common/m4k"
import { sleep } from "@common/helpers"
import { M4kFileInfo } from "@common/m4k/m4kInterface"

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
  await m4k.set('playlist', { items })

  await m4k.restart()
}

export default copyPlaylist