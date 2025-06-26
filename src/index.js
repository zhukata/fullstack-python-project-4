import axios from 'axios'
import fsp from 'fs/promises'
import { URL } from 'url'
import path from 'path'
import * as cheerio from 'cheerio'

const pageLoader = (link, dirname) => {
  const url = new URL(link)
  const { newDirPath, fullPath } = pathConstructor(url, dirname, 'html')
  return fsp.mkdir(newDirPath, { recursive: true })
    .then(() => axios.get(link))
    .then(response => fsp.writeFile(fullPath, response.data))
    .then(() => fullPath)
}

const pathConstructor = (url, dirname, extension) => {
  const fullUrl = `${url.host}${url.pathname}`
  const normalized = fullUrl
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')

  const newDirName = `${normalized}_files`
  const fileName = `${normalized}.${extension}`

  const newDirPath = path.join(dirname, newDirName)
  const fullPath = path.join(newDirPath, fileName)

  return { newDirPath, fullPath }
}

const pictureLoader = (link, dirname) => {
  const url = new URL(link)
  const { newDirPath, fullPath } = pathConstructor(url, dirname, 'png')

  return fsp.mkdir(newDirPath, { recursive: true })
    .then(() =>
      axios.get(link).then(res => downloadPicture(res.data, fullPath, url))
    )
    .then(() => fullPath)
}

const downloadPicture = (html, pathToDownload, url) => {
  const $ = cheerio.load(html)
  const imageUrl = $('img').attr('src')
  if (!imageUrl) {
    return Promise.reject(new Error('Image URL not found'))
  }

  const absoluteUrl = new URL(imageUrl, url).toString()
  return axios.get(absoluteUrl, { responseType: 'arraybuffer' })
    .then(response =>
      fsp.writeFile(pathToDownload, Buffer.from(response.data, 'binary'))
    )
    .then(() => pathToDownload)
}

export { pageLoader, pictureLoader }
