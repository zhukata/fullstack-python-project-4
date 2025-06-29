import fsp from 'fs/promises'
import { URL } from 'url'
import path from 'path'

import pathConstructor from './utils/pathConstructor.js'
import { loadHtml, downloadAssets } from './loaders.js'
import { extractAssets, rewriteAssetLinks } from './parsers.js'
import { logPath, logFlow } from './utils/logger.js'

export default (url, outputDir) => {
  const pageUrl = new URL(url)
  const dirName = pathConstructor(pageUrl, 'html').replace(/\.html$/, '_files')
  const resourcesDir = path.join(outputDir, dirName)
  const htmlFileName = pathConstructor(pageUrl, 'html')
  const htmlPath = path.join(outputDir, htmlFileName)

  logFlow('🔍 Проверка директории')
  return fsp.access(outputDir, fsp.constants.F_OK)
    .then(() => {
      logPath(`📁 Output directory доступна: ${outputDir}`)
      logPath(`📁 Resources directory: ${resourcesDir}`)
      logPath(`📄 HTML output file: ${htmlPath}`)
      logFlow('🚀 Начинаем загрузку страницы...')
      return fsp.mkdir(resourcesDir, { recursive: true })
    })
    .then(() => loadHtml(url))
    .then(({ html, origin }) => {
      logFlow('✅ HTML загружен')
      const assets = extractAssets(html, origin)
      logFlow(`🔗 Найдено ресурсов: ${assets.length}`)
      return downloadAssets(assets, resourcesDir, pageUrl)
        .then((assetMap) => {
          logFlow(`💾 Скачано файлов: ${assetMap.size}`)
          const updatedHtml = rewriteAssetLinks(html, assetMap, origin)
          return fsp.writeFile(htmlPath, updatedHtml).then(() => {
            logFlow('📝 HTML сохранён с локальными путями')
            return htmlPath
          })
        })
    })
}
