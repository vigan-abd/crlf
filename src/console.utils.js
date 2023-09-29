'use strict'

const prompt = require('prompt')

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
const consoleIn = async (text) => {
  const { answer } = await prompt.get({
    properties: {
      answer: {
        type: 'string',
        description: text,
        required: true
      }
    }
  })
  return answer
}

module.exports = {
  consoleIn
}
