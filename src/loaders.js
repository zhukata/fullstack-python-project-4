import axios from 'axios'
import fsp from 'fs/promises'
import path from 'path'
import Listr from 'listr'

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

export const downloadAssets = async (assets, resourcesDir) => {
  const assetMap = new Map()

  const tasks = assets.map(({ url }) => {
    const name = pathConstructor(new URL(url))
    const filePath = path.join(resourcesDir, name)
    assetMap.set(url, filePath)

    return {
      title: `${url}`,
      task: async (_, task) => {
        try {
          logAxios(`📡 axios.get → ${url}`)
          const response = await client.get(url, { responseType: 'arraybuffer' })
          await fsp.writeFile(filePath, response.data)
          logAxios(`📦 Saved ${url} → ${filePath}`)
        }
        catch (error) {
          task.title = `❌ Failed: ${url}`
          throw new Error(`Download error: ${error.message}`)
        }
      },
    }
  })

  const listr = new Listr(tasks, {
    concurrent: true,
    exitOnError: false,
  })

  await listr.run()

  return assetMap
}
