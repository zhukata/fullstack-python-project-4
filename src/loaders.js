import axios from 'axios'
import fsp from 'fs/promises'
import path from 'path'
import pathConstructor from './utils/pathConstructor.js'

export const loadHtml = (url) => {
  return axios.get(url)
    .then(res => ({
      html: res.data,
      origin: new URL(url),
    }))
}

export const downloadAssets = (assets, dir) => {
  const assetMap = new Map()
  const tasks = assets.map(({ url }) => {
    const { newDirPath, fullPath } = pathConstructor(new URL(url), dir, path.extname(url).slice(1) || 'bin')
    assetMap.set(url, fullPath)
    return fsp.mkdir(newDirPath, { recursive: true })
      .then(() => axios.get(url, { responseType: 'arraybuffer' }))
      .then(res => fsp.writeFile(fullPath, res.data))
  })

  return Promise.all(tasks).then(() => assetMap)
}
