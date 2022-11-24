const crypto = require('crypto');

const algorithm = 'sha256';

module.exports.encrypt = function(passw) {
    const hash = crypto.createHash(algorithm);

    hash.update(passw);
    return hash.digest('hex');
}
