import path from 'path'

export default (url, dirname, extension) => {
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
