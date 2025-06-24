import axios from 'axios'
import fsp from 'fs/promises'
import { URL } from 'url'
import path from 'path'

export default (link, dirname) => {
  const file = pathConstructor(link, dirname)
  return axios.get(link)
    .then(response => fsp.writeFile(file, response.data))
    .then(() => { return file })
}

const pathConstructor = (link, dirname) => {
  const url = new URL(link)
  const fullUrl = `${url.host}${url.pathname}`
  const normalized = fullUrl
    .replace(/[^a-zA-Z0-9]/g, '-') // заменяем всё, кроме букв и цифр, на '-'
    .replace(/-+/g, '-') // избавляемся от повторяющихся дефисов
    .replace(/(^-|-$)/g, '') // удаляем дефисы в начале и конце строки

  const fileName = `${normalized}.html`
  return path.join(dirname, fileName)
}
