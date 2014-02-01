'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport');


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables
var config = require('./config/config');

// Bootstrap db connection
mongoose.connect(config.db);
mongoose.connection.on('open', function() {
  console.log('We have connected to mongodb :)');
});

// Bootstrap models (.js and .coffee)
var modelsPath = __dirname + '/app/models';
var walk = function(path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(modelsPath);

// Bootstrap passport config
require('./config/passport')(passport);

var app = express();

// Express settings
require('./config/express')(app, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

// Start the app by listening on <port>
app.listen(config.port);
console.log('SimpleLogin API started on port ' + config.port);

// Expose app
exports = module.exports = app;
