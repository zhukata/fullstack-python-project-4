import { mkdtemp, readFile } from 'fs/promises'
import nock from 'nock'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import pageLoader from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getFixturePath = name => path.join(__dirname, '..', '__fixtures__', name)

let tempDir

beforeAll(() => {
  nock.disableNetConnect()
})

beforeEach(async () => {
  nock.cleanAll()
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'))
})

test('downloads page and saves correctly', async () => {
  const testUrl = 'https://ru.hexlet.io/courses'
  const testHtml = await readFile(getFixturePath('test_resources.html'))
  const pictureFixture = await readFile(getFixturePath('picture.png'))

  // Без портов! Просто нормальный базовый URL
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, testHtml)
    .get('/assets/professions/nodejs.png')
    .reply(200, pictureFixture, { 'Content-Type': 'image/png' })
    .get('/assets/application.css')
    .reply(200, 'body { background: #fff }', { 'Content-Type': 'text/css' })
    .get('/packs/js/runtime.js')
    .reply(200, 'console.log("runtime loaded")', { 'Content-Type': 'application/javascript' })

  const expectedHtml = await readFile(getFixturePath('expected.html'), 'utf-8')
  const outputPath = await pageLoader(testUrl, tempDir)
  const savedHtml = await readFile(outputPath, 'utf-8')

  expect(savedHtml).toBe(expectedHtml)

  const imagePath = path.join(tempDir, 'ru-hexlet-io-courses_files', 'ru-hexlet-io-assets-professions-nodejs.png')
  const savedImage = await readFile(imagePath)
  const imageFixture = await readFile(getFixturePath('picture.png'))

  expect(savedImage.equals(imageFixture)).toBe(true)

  // Убедимся, что все моки были использованы
  scope.done()
})
