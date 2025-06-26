import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdtemp, readFile } from 'fs/promises'
import nock from 'nock'
import { pageLoader, pictureLoader } from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getFixturePath = name => path.join(__dirname, '..', '__fixtures__', name)

const testUrl = 'https://ru.hexlet.io/courses'
const testHTML = await readFile(getFixturePath('test.html'), 'utf-8')

let tempDir

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'page-loader-'))
})

beforeAll(async () => {
  nock.disableNetConnect()
})

test('downloads page and saves correctly', async () => {
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, testHTML)

  const outputPath = await pageLoader(testUrl, tempDir)
  const expectedPath = path.join(tempDir, 'ru-hexlet-io-courses_files/ru-hexlet-io-courses.html')

  expect(outputPath).toBe(expectedPath)

  const savedContent = await readFile(expectedPath, 'utf-8')
  expect(savedContent).toBe(testHTML)
})

test('downloads picture and saves it correctly', async () => {
  const binaryFixture = await readFile(getFixturePath('picture.png'))

  // Имитация HTML с <img>
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, '<img src="/assets/professions/nodejs.png">')

  // Имитация самой картинки
  nock('https://ru.hexlet.io')
    .get('/assets/professions/nodejs.png')
    .reply(200, binaryFixture, {
      'Content-Type': 'image/png',
    })

  const savedPicturePath = await pictureLoader(testUrl, tempDir)
  const savedBuffer = await readFile(savedPicturePath)

  expect(savedBuffer.equals(binaryFixture)).toBe(true)
})