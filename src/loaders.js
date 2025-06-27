import axios from 'axios'
import fsp from 'fs/promises'
import path from 'path'
import pathConstructor from './utils/pathConstructor.js'
import { logAxios } from './utils/logger.js'

const client = axios.create()

client.interceptors.request.use((request) => {
  logAxios(`➡️ [${request.method?.toUpperCase()}] ${request.url}`)
  return request
})

client.interceptors.response.use((response) => {
  logAxios(`✅ [${response.status}] ${response.config.url}`)
  return response
}, (error) => {
  logAxios(`❌ [ERROR] ${error.config?.url} → ${error.message}`)
  return Promise.reject(error)
})

export const loadHtml = (url) => {
  logAxios(`📡 axios.get → ${url}`)
  return client.get(url)
    .then(res => ({
      html: res.data,
      origin: new URL(url),
    }))
}

export const downloadAssets = (assets, resourcesDir) => {
  const assetMap = new Map()

  const tasks = assets.map(({ url }) => {
    const name = pathConstructor(new URL(url))
    const filePath = path.join(resourcesDir, name)
    assetMap.set(url, filePath)
    logAxios(`📡 axios.get → ${url}`)
    return client.get(url, { responseType: 'arraybuffer' })
      .then(res => fsp.writeFile(filePath, res.data))
      .then(() => logAxios(`📦 Saved ${url} → ${filePath}`))
      .catch(err => logAxios(`❌ Failed to download ${url}: ${err.message}`))
  })

  return Promise.all(tasks).then(() => assetMap)
}
