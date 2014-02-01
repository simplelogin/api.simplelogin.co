'use strict';

/**
 * Module dependencies.
 */
var express = require('express');


module.exports = function(app, passport) {

  //Enable jsonp
  app.enable('jsonp callback');

  // Request body parsing middleware should be above methodOverride
  app.use(express.json());
  app.use(express.favicon());
  app.use(express.urlencoded());
  app.use(express.methodOverride());

  // Ensure that all data are compressed (utilize bandwidth)
  app.set('json spaces', 0);
  app.use(express.compress());

  // Use passport session
  app.use(passport.initialize());

  // Only use logger for development environment
  if (process.env.NODE_ENV === 'development') {
    app.use(express.logger('dev'));
  }

  //routes should be at the last
  app.use(app.router);

  // Assume "not found" in the error msgs is a 404. this is somewhat
  // silly, but valid, you can do whatever you like, set properties,
  // use instanceof etc.
  app.use(function(req, res) {
    res
      .status(404)
      .jsonp({
        status: 404,
        message: 'Not found'
      });
  });

  // Assume 404 since no middleware responded
  app.use(function(err, req, res) {
    res
      .status(err.status || 500)
      .json({
        status: err.status,
        message: err.msg
      });
  });

};
