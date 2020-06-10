var crypto = require('crypto');

const MIN = 5;
const MAX = 10

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

var generate = function() {
    var shasum = crypto.createHash('sha1');
    shasum.update((new Date).getTime()+'');
    return shasum.digest('hex').substring(0, randomInt(MIN, MAX));
}

exports.generate = generate;
exports.MIN = MIN;
exports.MAX = MAX;
