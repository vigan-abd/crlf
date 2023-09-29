'use strict'

/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { convert, convertFile } = require('../src/convert')
const { CONVERT_TYPES } = require('../src/constants')

describe('convert tests', () => {
  describe('convert', () => {
    it('should convert CRLF to LF', () => {
      const input = 'Hello\r\nWorld'
      const output = convert(input, CONVERT_TYPES.LF)
      assert.strictEqual(output, 'Hello\nWorld')
    })

    it('should convert LF to CRLF', () => {
      const input = 'Hello\nWorld'
      const output = convert(input, CONVERT_TYPES.CRLF)
      assert.strictEqual(output, 'Hello\r\nWorld')
    })

    it('should throw an error for invalid type', () => {
      const input = 'Hello\nWorld'
      assert.throws(() => convert(input, 'INVALID'), /ERR_CONVERT_TYPE_INVALID/)
    })
  })

  describe('convertFile', () => {
    const tempDir = path.join(__dirname, 'temp')
    const tempFilePath = path.join(tempDir, 'temp.txt')

    beforeEach(async () => {
      if (!fs.existsSync(tempDir)) {
        await fs.promises.mkdir(tempDir, { recursive: true })
      }
      await fs.promises.writeFile(tempFilePath, 'Hello\nWorld')
    })

    afterEach(async () => {
      await fs.promises.unlink(tempFilePath)
      await fs.promises.rmdir(tempDir)
    })

    it('should convert LF to CRLF in a file', async () => {
      await convertFile(tempFilePath, CONVERT_TYPES.CRLF)
      const content = await fs.promises.readFile(tempFilePath, { encoding: 'utf8' })
      assert.strictEqual(content, 'Hello\r\nWorld')
    })

    it('should convert CRLF to LF in a file', async () => {
      await fs.promises.writeFile(tempFilePath, 'Hello\r\nWorld', { encoding: 'utf-8', flag: 'w' })

      await convertFile(tempFilePath, CONVERT_TYPES.LF)
      const content = await fs.promises.readFile(tempFilePath, { encoding: 'utf8' })
      assert.strictEqual(content, 'Hello\nWorld')
    })

    it('should throw an error for invalid type in a file', async () => {
      assert.rejects(() => convertFile(tempFilePath, 'INVALID'), /ERR_CONVERT_TYPE_INVALID/)
    })
  })
})
