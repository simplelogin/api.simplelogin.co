'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: 'mongodb://localhost/simplelogin' || process.env.MONGOHQ_URL,
  apiVersion: 1,

  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'S3CR37'
};
