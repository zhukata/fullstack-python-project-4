import { mkdtemp, readFile } from 'fs/promises'
import * as cheerio from 'cheerio'
import os from 'os'
import nock from 'nock'
import path from 'path'
import { fileURLToPath } from 'url'
import pageLoader from '../src/index.js'
import { mockHtmlPage, mockBinary, mockText } from '../src/utils/mockRequest.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getFixturePath = name => path.join(__dirname, '..', '__fixtures__', name)

let tempDir

beforeAll(() => {
})

beforeEach(async () => {
  nock.cleanAll()
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'))
})

// afterEach(() => {
//   const pending = nock.pendingMocks()
//   if (pending.length > 0) {
//     console.warn('⚠️ Остались непойманные моки:', pending)
//   }
// })

test('downloads page and saves correctly', async () => {
  const testUrl = 'https://ru.hexlet.io/courses'

  // Все моки должны быть созданы ДО вызова pageLoader
  await Promise.all([
    mockHtmlPage(testUrl, 'test_resources.html'),
    mockBinary('https://ru.hexlet.io/assets/professions/nodejs.png', 'picture.png', 'image/png'),
    mockText('https://ru.hexlet.io/assets/application.css', 'body { background: #fff }', 'text/css'),
    mockText('https://ru.hexlet.io/packs/js/runtime.js', 'console.log("Hi")', 'application/javascript'),
  ])

  const expectedHtml = await readFile(getFixturePath('expected.html'), 'utf-8')
  const outputPath = await pageLoader(testUrl, tempDir)
  const savedHtml = await readFile(outputPath, 'utf-8')

  expect(normalizeHtml(savedHtml)).toBe(normalizeHtml(expectedHtml))

  const imagePath = path.join(tempDir, 'ru-hexlet-io-courses_files', 'ru-hexlet-io-assets-professions-nodejs.png')
  const savedImage = await readFile(imagePath)
  const imageFixture = await readFile(getFixturePath('picture.png'))
  expect(savedImage.equals(imageFixture)).toBe(true)
})

function normalizeHtml(input) {
  const $ = cheerio.load(input)
  return $.html()
}
