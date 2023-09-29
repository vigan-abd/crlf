'use strict'

const fs = require('fs')

const { CONVERT_TYPES } = require('./constants')

/**
 *
 * @param {string} content
 * @param {'LF'|'CRLF'} type
 * @returns {string}
 */
const convert = (content, type) => {
  switch (type) {
    case CONVERT_TYPES.LF:
      return content.replace(/\r\n/g, '\n')
    case CONVERT_TYPES.CRLF:
      return content.replace(/\r?\n/g, '\r\n')
    default:
      throw new Error('ERR_CONVERT_TYPE_INVALID')
  }
}

/**
 * @param {string} filepath
 * @param {'LF'|'CRLF'} type
 * @param {string} [encoding]
 * @returns {Promise<void>}
 */
const convertFile = async (filepath, type, encoding = 'utf-8') => {
  const content = await fs.promises.readFile(filepath, { encoding })
  await fs.promises.writeFile(filepath, convert(content, type), { flag: 'w' })
}

module.exports = {
  convert,
  convertFile
}
