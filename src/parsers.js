import path from 'path'
import * as cheerio from 'cheerio'

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

  return assets
}

export const rewriteAssetLinks = (html, assetMap) => {
  const $ = cheerio.load(html)

  for (const [url, localPath] of assetMap.entries()) {
    const relative = path.basename(localPath)
    $(`[src='${url}'], [href='${url}']`).each((_, el) => {
      if (el.attribs.src === url) el.attribs.src = relative
      if (el.attribs.href === url) el.attribs.href = relative
    })
  }

  return $.html()
}
