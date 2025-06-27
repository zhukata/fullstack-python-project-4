import fsp from 'fs/promises'
import { URL } from 'url'
import path from 'path'

import pathConstructor from './utils/pathConstructor.js'
import { loadHtml, downloadAssets } from './loaders.js'
import { extractAssets, rewriteAssetLinks } from './parsers.js'
import { logPath } from './utils/logger.js'
import { buildErrorMessage } from './utils/errors.js'

export default (url, outputDir) => {
  const pageUrl = new URL(url)
  const dirName = pathConstructor(pageUrl, 'html').replace(/\.html$/, '_files')
  const resourcesDir = path.join(outputDir, dirName)
  const htmlFileName = pathConstructor(pageUrl, 'html')
  const htmlPath = path.join(outputDir, dirName, htmlFileName)

  logPath(`📁 Directory: ${resourcesDir}`)
  logPath(`📄 File: ${htmlPath}`)

  return fsp.mkdir(resourcesDir, { recursive: true })
    .then(() => loadHtml(url))
    .then(({ html, origin }) => {
      const assets = extractAssets(html, origin)
      return downloadAssets(assets, resourcesDir).then((assetMap) => {
        const updated = rewriteAssetLinks(html, assetMap, origin)
        return fsp.writeFile(htmlPath, updated).then(() => htmlPath)
      })
    })
    .catch((err) => {
      const msg = buildErrorMessage(err, url)
      throw new Error(msg)
    })
}
