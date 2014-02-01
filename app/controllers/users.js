'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto');

/**
 * Models dependencies.
 */
var User = mongoose.model('User'),
    Token = mongoose.model('Token');

/**
 * Show login form
 */
exports.login = function(req, res) {
  var user = req.user;

  User.findOne({
    username: user.username
  }, function(error, user) {
    if (error) {
      return res.jsonp({
        status: 500,
        message: error
      });
    }

    if (!user) {
      return res.jsonp({
        status: 200,
        message: 'Unknown user'
      });
    }

    user.verifyPassword(user.password, function(err, passwordCorrect) {
      if (err) {
        return res.jsonp({
          status: 500,
          message: err
        });
      }

      if (!passwordCorrect) {
        return res.jsonp({
          status: 200,
          message: 'Incorrect password'
        });
      }

      crypto.randomBytes(48, function(ex, buf) {
        if (ex) {
          return res.jsonp({
            status: 500,
            message: ex
          });
        }

        var token = buf.toString('hex');
        var newToken = new Token({
          _user: user,
          token: token,
          user_agent: req.headers['user-agent']
        });

        newToken.save(function(e) {
          if (e) {
            return res.jsonp({
              status: 500,
              message: e
            });
          }

          return res.jsonp({
            iterations: user.iterations,
            token: token
          });
        });
      });
    });
  });
};

/**
 * Logout
 */
exports.logout = function(req, res) {
  Token
    .findOneAndRemove({
      _user: req.user._id,
      token: req.body.access_token
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
};

/**
 * Create user
 */
exports.create = function(req, res) {
  var message = null;
  var user = new User(req.body);

  user.joined_from = {
    mobile: req.body.mobile,
    app: req.body.app
  };

  user.save(function(err) {
    if (err) {
      switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Please fill all the required fields';
      }

      return res.jsonp({
        status: 500,
        message: message
      });
    }

    res.jsonp({ status: 200 });
  });
};

/**
 * Send User
 */
exports.me = function(req, res) {
  var response;

  if (req.user) {
    var user = req.user;

    response = {
      status: 200,
      data: {
        user: {
          id: user._id,
          username: user.username,
          first_login: user.first_login,
          name: user.name,
          email: user.email,
          premium: user.premium,
          credential_limits: user.credential_limits,
          ref_code: user.ref_code,
          lang: user.lang,
          gender: user.gender,
          country: user.country,
          storage: user.storage.service,
          billing_date: user.billing_date
        }
      }
    };
  } else {
    response = {
      status: 530,
      message: 'User not logged'
    };
  }

  res.jsonp(response);
};

/**
 * First Login
 */
exports.firstLogin = function(req, res) {
  var user = req.user;

  user.first_login = false;
  user.save(function(err) {
    if (err) {
      return res.jsonp({
        status: 500,
        message: err
      });
    }

    res.jsonp({ status: 200 });
  });
};

/**
 * Update user data
 */
exports.update = function(req, res) {
  User
    .findByIdAndUpdate(req.user._id, {
      name: {
        first: req.body.fname,
        last: req.body.lname
      },
      email: req.body.email,
      lang: req.body.lang,
      gender: req.body.gender,
      country: req.body.country
    })
    .exec(function(err, user) {
      if (err) {
        return res.jsonp({
          status: 500,
          message: err
        });
      }

      if (!user) {
        return res.jsonp({
          error: 404,
          message: 'User not found'
        });
      }

      res.jsonp({
        status: 200,
        data: {
          user: {
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            premium: user.premium,
            lang: user.lang,
            gender: user.gender,
            country: user.country
          }
        }
      });
    });
};

/**
 * Update data
 */
exports.updateData = function(req, res) {
  User
    .findByIdAndUpdate(req.user._id, {
      data: req.body.data
    })
    .exec(function(err, user) {
      if (err) {
        return res.jsonp({
          status: 500,
          message: err
        });
      }

      if (!user) {
        return res.jsonp({
          error: 404,
          message: 'User not found'
        });
      }

      res.jsonp({ status: 200 });
    });
};
