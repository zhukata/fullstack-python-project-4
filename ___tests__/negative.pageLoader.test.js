import { mkdtemp } from 'fs/promises'
import os from 'os'
import nock from 'nock'
import path from 'path'
import pageLoader from '../src/index.js'

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

test('ошибка при загрузке ресурса (404)', async () => {
  const testUrl = 'https://example.com/page'
  nock('https://example.com').get('/page').times(Infinity).reply(404)
  console.log('🎯 Active mocks до вызова pageLoader:', nock.activeMocks())

  await expect(pageLoader(testUrl, tempDir)).rejects.toThrow(`Не удалось загрузить ${testUrl} (код 404)`)
})

test('ошибка записи в защищённую директорию', async () => {
  const forbiddenPath = '/root/secret'
  const testUrl = 'https://example.com/page'
  nock('https://example.com').get('/page').times(Infinity).reply(200, '<html></html>')

  await expect(pageLoader(testUrl, forbiddenPath)).rejects.toThrow(`Недостаточно прав для записи в директорию`)
})
