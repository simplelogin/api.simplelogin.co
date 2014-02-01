'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Backup Schema
 */
var BackupSchema = new Schema({
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

mongoose.model('Backup', BackupSchema);
