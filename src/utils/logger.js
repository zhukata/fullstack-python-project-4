import createDebug from 'debug'

export const logAxios = createDebug('page-loader:axios')
export const logNock = createDebug('page-loader:nock')
export const logPath = createDebug('page-loader:path')
export const logFlow = createDebug('page-loader:flow')
