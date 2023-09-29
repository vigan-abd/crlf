'use strict'

/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const sinon = require('sinon')

const fileUtils = require('../src/file.utils')
const consoleUtils = require('../src/console.utils')
const convertUtils = require('../src/convert')
const main = require('../bin/crlf')

describe('main', () => {
  let resolveFilesStub, consoleInStub, convertFileStub
  const tempDir = path.join(__dirname, 'temp')
  const file1Path = path.join(tempDir, 'file1.txt')
  const file2Path = path.join(tempDir, 'file2.txt')

  beforeEach(async () => {
    resolveFilesStub = sinon.stub(fileUtils, 'resolveFiles')
    consoleInStub = sinon.stub(consoleUtils, 'consoleIn')
    convertFileStub = sinon.stub(convertUtils, 'convertFile')

    if (!fs.existsSync(tempDir)) {
      await fs.promises.mkdir(tempDir, { recursive: true })
    }
    await fs.promises.writeFile(file1Path, 'Hello\nWorld', 'utf8')
    await fs.promises.writeFile(file2Path, 'Hi\r\nUniverse', 'utf8')
  })

  afterEach(async () => {
    sinon.restore()
    await fs.promises.unlink(file1Path)
    await fs.promises.unlink(file2Path)
    await fs.promises.rmdir(tempDir)
  })

  it('should abort if user does not confirm', async () => {
    resolveFilesStub.resolves(['file1.txt', 'file2.txt'])
    consoleInStub.resolves('N')

    await main({ type: 'lf', pattern: '*.txt', encoding: 'utf-8' })

    assert.strictEqual(convertFileStub.called, false)
  })

  it('should convert files if user confirms', async () => {
    resolveFilesStub.resolves(['file1.txt', 'file2.txt'])
    consoleInStub.resolves('Y')
    convertFileStub.resolves()

    await main({ type: 'lf', pattern: '*.txt', encoding: 'utf-8' })

    assert.strictEqual(convertFileStub.callCount, 2)
  })

  it('should convert LF to CRLF in file1', async () => {
    resolveFilesStub.resolves([file1Path])
    consoleInStub.resolves('Y')
    convertFileStub.restore()

    await main({ type: 'crlf', pattern: '*.txt', encoding: 'utf-8' })

    const content = await fs.promises.readFile(file1Path, 'utf8')
    assert.strictEqual(content, 'Hello\r\nWorld')
  })

  it('should convert CRLF to LF in file2', async () => {
    resolveFilesStub.resolves([file2Path])
    consoleInStub.resolves('Y')
    convertFileStub.restore()

    await main({ type: 'lf', pattern: '*.txt', encoding: 'utf-8' })

    const content = await fs.promises.readFile(file2Path, 'utf8')
    assert.strictEqual(content, 'Hi\nUniverse')
  })
})
