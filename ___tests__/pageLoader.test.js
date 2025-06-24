import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdtemp, readFile } from 'fs/promises'
import nock from 'nock'
import pageLoader from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const testUrl = 'https://ru.hexlet.io/courses'
const testHTML = '<html><head><title>Test</title></head><body>Hello</body></html>'

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
  const expectedPath = path.join(tempDir, 'ru-hexlet-io-courses.html')

  expect(outputPath).toBe(expectedPath)

  const savedContent = await readFile(expectedPath, 'utf-8')
  expect(savedContent).toBe(testHTML)
})
