'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt');

/**
 * User Schema
 */
var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  salt: String,
  hash: String,
  data: String,
  iterations: {
    type: Number,
    default: 10000
  },
  lang: {
    type: String,
    default: 'es'
  },
  gender: String,
  country: String,
  status: {
    type: Boolean,
    default: true
  },
  first_login: {
    type: Boolean,
    default: true
  },
  premium: {
    type: Boolean,
    default: false
  },
  billing_date: Date,
  ref_code: String,
  referred_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  credential_limits: {
    type: Number,
    default: 5
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Virtuals
 */
UserSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});

UserSchema.virtual('password').set(function(password) {
  this._password = password;
  var salt = this.salt = bcrypt.genSaltSync();
  this.hash = bcrypt.hashSync(password, salt);
}).get(function() {
  return this._password;
});

UserSchema.method('verifyPassword', function(password, callback) {
  if (!this.hash) {
    return callback(null, false);
  }
  return bcrypt.compare(password, this.hash, callback);
});

mongoose.model('User', UserSchema);
