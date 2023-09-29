'use strict'

const glob = require('glob')

/**
 * @param {string} pattern
 * @returns {Promise<Array<string>>}
 */
const resolveFiles = (pattern) => {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => err ? reject(err) : resolve(files))
  })
}

module.exports = {
  resolveFiles
}
