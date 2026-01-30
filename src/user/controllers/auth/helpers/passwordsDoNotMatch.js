const { buildErrObject } = require('../../../../v1/middlewares/buildErrObject')

/**
 * 
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async (user = {}) => {
  return new Promise((resolve, reject) => {
    try {
      return reject(buildErrObject(409, 'WRONG_PASSWORD'))
    } catch (error) {
      throw error
    }
  })
}

module.exports = { passwordsDoNotMatch }
