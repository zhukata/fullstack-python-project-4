import nock from 'nock'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getFixturePath = name => path.join(__dirname, '..', '..', '__fixtures__', name)

export const mockHtmlPage = async (url, fixtureName) => {
  const html = await readFile(getFixturePath(fixtureName), 'utf-8')
  const pageUrl = new URL(url)

  nock(pageUrl.origin)
    .get(pageUrl.pathname)
    .times(Infinity)
    .reply(200, html)
}

export const mockBinary = async (absoluteUrl, fixtureName, contentType = 'application/octet-stream') => {
  const data = await readFile(getFixturePath(fixtureName))
  const assetUrl = new URL(absoluteUrl)

  nock(assetUrl.origin)
    .get(assetUrl.pathname)
    .reply(200, data, {
      'Content-Type': contentType,
    })
}

export const mockText = (absoluteUrl, body, contentType = 'text/plain') => {
  const url = new URL(absoluteUrl)

  nock(url.origin)
    .get(url.pathname)
    .reply(200, body, {
      'Content-Type': contentType,
    })
}
