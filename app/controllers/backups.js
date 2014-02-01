'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Models dependencies.
 */
var Backup = mongoose.model('Backup');

/**
 * List of backups
 */
exports.all = function(req, res) {
  var service = req.user.storage.service;

  if (service === 'dropbox') {
    console.log('dropbox all');
  } else if (service === 'simplelogin') {
    Backup
      .find({
        _user: req.user._id
      }, {
        __v: 0,
        _user: 0,
        data: 0
      })
      .sort('-created')
      .exec(function(err, backups) {
        if (err) {
          return res.jsonp({
            status: 500,
            message: err
          });
        }

        if (!backups) {
          return res.jsonp({
            status: 404,
            message: 'Backups not found.'
          });
        }

        res.jsonp({
          status: 200,
          data: {
            backups: backups
          }
        });
      });
  }
};

/**
 * Create a backup
 */
exports.create = function(req, res) {
  var service = req.user.storage.service;

  if (req.user.premium) {
    if (service === 'dropbox') {
      console.log('dropbox create');
    } else if (service === 'simplelogin') {
      var backup = new Backup({
        _user: req.user,
        data: req.body.data
      });

      backup.save(function(err) {
        if (err) {
          return res.jsonp({
            status: 500,
            message: err
          });
        }

        res.jsonp({
          status: 200,
          data: {
            backup: {
              _id: backup._id,
              created: backup.created
            }
          }
        });
      });
    }
  } else {
    res.jsonp({
      status: 403,
      message: 'You must be a Premium user for this action.'
    });
  }
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
  var service = req.user.storage.service;

  if (req.user.premium) {
    if (service === 'dropbox') {
      console.log('dropbox delete');
    } else if (service === 'simplelogin') {
      Backup
        .findOneAndRemove({
          _id: req.params.backupId,
          _user: req.user._id
        })
        .exec(function(err) {
          if (err) {
            return res.jsonp({
              status: 500,
              message: err
            });
          }

          res.jsonp({ status: 200 });
        });
    }
  } else {
    res.jsonp({
      status: 403,
      message: 'You must be a Premium user for this action.'
    });
  }
};

/**
 * Restore a backup
 */
exports.restore = function(req, res) {
  var service = req.user.storage.service;

  if (req.user.premium) {
    if (service === 'dropbox') {
      console.log('dropbox restore');
    } else if (service === 'simplelogin') {
      Backup
        .findOne({
          _id: req.params.id,
          _user: req.user._id
        })
        .exec(function(err, backup) {
          if (err) {
            return res.jsonp({
              status: 500,
              message: err
            });
          }

          if (!backup) {
            return res.jsonp({
              status: 404,
              message: 'Backup not found'
            });
          }

          req.user.data = backup.data;
          req.user.save(function(err) {
            if (err) {
              return res.jsonp({
                status: 500,
                message: err
              });
            }

            res.jsonp({ status: 200 });
          });
        });
    }
  } else {
    res.jsonp({
      status: 403,
      message: 'You must be a Premium user for this action.'
    });
  }
};
