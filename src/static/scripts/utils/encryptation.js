const crypto = require('crypto');

const algorithm = 'sha256';

function encrypt(passw) {
    const hash = crypto.createHash(algorithm);

    hash.update(passw);
    return hash.digest('hex');
}

module.exports = {
    encrypt,
}