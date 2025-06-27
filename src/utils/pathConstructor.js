import path from 'path'
import { logPath } from './logger.js'

export default (url, extension = 'html') => {
  const { hostname, pathname } = url
  const slug = `${hostname}${pathname}`
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')

  const ext = path.extname(pathname) || `.${extension}`
  const fileName = slug.replace(new RegExp(`${ext}$`), '') + ext

  logPath(`🔧 URL: ${url.toString()}`)
  logPath(`📄 File: ${fileName}`)

  return fileName
}
