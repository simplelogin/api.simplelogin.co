'use strict';

/**
 * Get storage service
 */
exports.get = function(req, res) {
  res.jsonp({
    status: 200,
    message: 'storage get'
  });
};

/**
 * Get storage service activation
 */
exports.getActivate = function(req, res) {
  res.jsonp({
    status: 200,
    message: 'storage getActivate'
  });
};
