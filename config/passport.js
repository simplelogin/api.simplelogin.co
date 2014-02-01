'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  BearerStrategy = require('passport-http-bearer').Strategy,
  Token = mongoose.model('Token');


module.exports = function(passport) {

  // User Bearer strategy
  passport.use(new BearerStrategy(function(token, done) {
    process.nextTick(function() {
      var expiration = new Date(+new Date() - 36000000);

      Token
        .remove({
          token: token,
          last_access: {
            $lte: expiration
          }
        })
        .exec(function() {
          Token
            .findOne({
              token: token
            })
            .populate('_user')
            .exec(function(err, token) {
              if (err) return done(err);

              if (!token._user) {
                return done(null, false, {
                  message: 'Unknown user'
                });
              }

              token.last_access = new Date(Date.now());
              token.save(function(err) {
                if (err) return done(err);

                done(null, token._user, { scope: 'all' });
              });
            });
        });
    });
  }));

};
