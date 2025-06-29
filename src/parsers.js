import path from 'path'
import * as cheerio from 'cheerio'
import _ from 'lodash'

export const extractAssets = (html, baseUrl) => {
  const $ = cheerio.load(html)
  const assets = []

  const baseHost = baseUrl.host

  $('img[src], link[href], script[src]').each((_, el) => {
    const tag = el.tagName
    const attr = tag === 'link' ? 'href' : 'src'
    const value = $(el).attr(attr)
    if (!value || value.startsWith('data:')) return

    const absoluteUrl = new URL(value, baseUrl)

    // Фильтруем только ресурсы с того же хоста
    if (absoluteUrl.host !== baseHost) return

    assets.push({ url: absoluteUrl.toString(), tag, attr })
  })
  const uniqueAssets = _.uniqBy(assets, 'url')
  return uniqueAssets
}

export const rewriteAssetLinks = (html, assetMap, baseUrl) => {
  const $ = cheerio.load(html)

  for (const [url, localPath] of assetMap.entries()) {
    const relativeDir = path.basename(path.dirname(localPath))
    const fileName = path.basename(localPath)
    const finalPath = path.join(relativeDir, fileName)

    $('[src], [href]').each((_, el) => {
      const attr = el.attribs.src ? 'src' : 'href'
      const original = el.attribs[attr]
      if (!original) return

      let resolved
      try {
        resolved = new URL(original, baseUrl).toString()
      }
      catch {
        return
      }

      if (resolved === url) {
        el.attribs[attr] = finalPath
      }
    })
  }

  return $.html()
}
