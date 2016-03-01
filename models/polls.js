/* jslint node: true */

'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Poll = new Schema({
  author: String,
  title: String,
  options: [{name: String, count: Number}],
  voted: Array
});

module.exports = mongoose.model('Poll', Poll);
