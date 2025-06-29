#!/usr/bin/env node
import { program } from 'commander'

import buildErrorMessage from '../src/utils/errors.js'
import pageLoader from '../src/index.js'

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0', '-V, --version', 'output the version number')
  .helpOption('-h, --help', 'display help for command')
  .option('-o, --output [dir]', 'output dir (default: current directory)', process.cwd())
  .argument('<link>', 'URL of the page to download')
  .action((link) => {
    const outputDir = program.opts().output
    pageLoader(link, outputDir)
      .then(resultPath => console.log(resultPath))
      .catch((err) => {
        buildErrorMessage(err)
        process.exit(1)
      })
  })

program.parse(process.argv)
