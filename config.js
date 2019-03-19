'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL ||
'mongodb://127.0.0.1/bitsynth';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://127.0.0.1/test-bitsynth';
exports.PORT = process.env.PORT || 3000;
