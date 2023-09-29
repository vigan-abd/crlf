#!/usr/bin/env node

'use strict'

const os = require('os')
const prompt = require('prompt')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

const fileUtils = require('../src/file.utils')
const consoleUtils = require('../src/console.utils')
const convertUtils = require('../src/convert')

const main = async (argv) => {
  let { type, pattern, encoding } = argv
  type = type.toUpperCase()
  encoding = encoding || 'utf-8'

  prompt.start()
  const files = await fileUtils.resolveFiles(pattern)
  console.log('Files found:')
  console.group()
  console.log(files.map(f => `- ${f}`).join(os.EOL))
  console.groupEnd()

  console.log('Conversion type:', type)
  console.log('File encodings:', encoding)
  const answer = await consoleUtils.consoleIn('Continue operation? Y - Yes, other No')
  if (answer !== 'Y') {
    console.log('Aborting...')
    return
  }

  for (const filepath of files) {
    await convertUtils.convertFile(filepath, type, encoding)
  }
}
module.exports = main

if (require.main === module) {
  const argv = yargs(hideBin(process.argv))
    .option('type', { desc: 'type of line endings (lf or crlf)', type: 'string', choices: ['lf', 'crlf'], demandOption: true })
    .option('pattern', { desc: 'glob pattern to match files, use quotes!', type: 'string', demandOption: true })
    .option('encoding', { type: 'string', desc: 'file encodings', default: 'utf-8' })
    .help()
    .alias('h', 'help')
    .argv

  main(argv).catch((err) => {
    console.error(err)
    process.exit(-1)
  })
}
