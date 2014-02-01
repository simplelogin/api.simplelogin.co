'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Device Schema
 */
var DeviceSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  data: String,
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Device', DeviceSchema);
