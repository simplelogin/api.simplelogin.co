'use strict';

/**
 * Module dependencies.
 */
var config = require('./config');


module.exports = function(app, passport) {

  // Set the prefix according the API version
  var apiPrefix = '/v' + config.apiVersion + '/';

  // Enable CORS
  app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
  });

  // Test URL
  app.get('/test', function(req, res) {
    return res.send('Hello world! (SimpleLogin API v' + config.apiVersion + ') :D');
  });

  // Auth Routes
  var users = require('../app/controllers/users');
  app.post(apiPrefix + 'auth', users.login);
  app.post(apiPrefix + 'join', users.create);
  app.del(apiPrefix + 'logout', passport.authenticate('bearer', { session: false }), users.logout);

  // Users Routes
  app.get(apiPrefix + 'users/me', users.me);
  app.put(apiPrefix + 'users/me', passport.authenticate('bearer', { session: false }), users.update);
  app.post(apiPrefix + 'users/me/first_login', passport.authenticate('bearer', { session: false }), users.firstLogin);

  // Data
  app.put(apiPrefix + 'data', passport.authenticate('bearer', { session: false }), users.updateData);

  // Backup Routes
  var backups = require('../app/controllers/backups');
  app.get(apiPrefix + 'backups', passport.authenticate('bearer', { session: false }), backups.all);
  app.post(apiPrefix + 'backups', passport.authenticate('bearer', { session: false }), backups.create);
  app.del(apiPrefix + 'backups/:backupId', passport.authenticate('bearer', { session: false }), backups.destroy);
  app.post(apiPrefix + 'backups/restore', passport.authenticate('bearer', { session: false }), backups.restore);

  // Storage
  var storages = require('../app/controllers/storages');
  app.get(apiPrefix + 'storages/:service', passport.authenticate('bearer', { session: false }), storages.get);
  app.get(apiPrefix + 'storages/:service/activate', passport.authenticate('bearer', { session: false }), storages.getActivate);

};
