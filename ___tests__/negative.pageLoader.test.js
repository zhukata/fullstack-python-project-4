import { mkdtemp } from 'fs/promises'
import os from 'os'
import nock from 'nock'
import { AxiosError } from 'axios'
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

test('with non-existent link', async () => {
  const testUrl = 'https://example.com/page'
  nock('https://example.com').get('/page').times(Infinity).reply(404)
  console.log('🎯 Active mocks до вызова pageLoader:', nock.activeMocks())

  await expect(pageLoader(testUrl, tempDir)).rejects.toBeInstanceOf(AxiosError)
})

test('with non-existent outputPath', async () => {
  const nonExistsPath = 'non-exist/path'
  const testUrl = 'https://example.com/page'
  nock('https://example.com').get('/page').times(Infinity).reply(200, '<html></html>')

  await expect(pageLoader(testUrl, nonExistsPath)).rejects.toThrow(`ENOENT: no such file or directory, access '${nonExistsPath}'`)
})

test('with no permission outputPath', async () => {
  const forbiddenPath = '/root/secret'
  const testUrl = 'https://example.com/page'
  nock('https://example.com').get('/page').times(Infinity).reply(200, '<html></html>')

  await expect(pageLoader(testUrl, forbiddenPath)).rejects.toThrow(`EACCES: permission denied, access '${forbiddenPath}'`)
})
