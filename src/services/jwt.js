const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const ApiError = require('../utils/ApiError');

const blacklistData = [];

/**
 *
 * @param {Number} id Userid
 * @returns {String}
 */
function generateAccessToken(id, role) {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' });
}

/**
 *
 * @param {String} token
 * @returns {{ id: Number }}
 */
function toBlacklist(token) {
  blacklistData.push(token);
}

function verifyAccessToken(token) {
  blacklistData.forEach((element) => {
    if (token === element) {
      throw new ApiError('Invalid token', 401);
    }
  });
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
