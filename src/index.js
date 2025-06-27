import fsp from 'fs/promises'
import { URL } from 'url'

import pathConstructor from './utils/pathConstructor.js'
import { loadHtml, downloadAssets } from './loaders.js'
import { extractAssets, rewriteAssetLinks } from './parsers.js'

export default (url, outputDir) => {
  return loadHtml(url)
    .then(({ html, origin }) => {
      const assets = extractAssets(html, origin)
      return downloadAssets(assets, outputDir)
        .then(assetMap => rewriteAssetLinks(html, assetMap))
        .then((updatedHtml) => {
          const { fullPath } = pathConstructor(new URL(url), outputDir, 'html')
          return fsp.writeFile(fullPath, updatedHtml).then(() => fullPath)
        })
    })
}
