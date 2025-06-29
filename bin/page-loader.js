#!/usr/bin/env node
import { Command } from 'commander'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import buildErrorMessage from '../src/utils/errors.js'

import pageLoader from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const program = new Command()

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0', '-V, --version', 'output the version number')
  .helpOption('-h, --help', 'display help for command')
  .option('-o, --output [dir]', 'output dir (default: current directory)', __dirname)
  .argument('<link>', 'URL of the page to download')
  .action((link, options) => {
    const outputDir = typeof options.output === 'string' ? options.output : __dirname

    pageLoader(link, outputDir)
      .then(resultPath => console.log(resultPath))
      .catch((err) => {
        buildErrorMessage(err)
        process.exit(1)
      })
  })

program.parse(process.argv)
