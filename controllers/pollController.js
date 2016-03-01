/* jslint node : true */

'use strict';

var Poll = require('../models/polls');

function createNewPoll(userid, title, option) {
  var newPoll = new Poll();
  newPoll.author = userid;
  newPoll.title = title;
  var filtered = option.filter(function(each) {
      return (each != '' && each != '...');
  });
  var optionObjs = filtered.map(function(each) {
      return {name: each, count: 0};
  });
  newPoll.options = optionObjs;
  newPoll.voted = [];
  newPoll.save(function(err, poll) {
    if (err) {
      throw err;
    }
    console.log('New Poll Created: ' + poll._id);
  });
}

function viewPolls(userid, pollid, cb) {
  if (userid) {
    Poll.find({'author': userid}, function(err, myPolls) {
      if (err) {
        throw err;
      }
      cb(myPolls);
    });
  } else if (pollid) {
    Poll.find({'_id': pollid}, function(err, poll) {
      if (err) {
        throw err;
      }
      cb(poll);
    });
  } else {
    Poll.find({}, function(err, allPolls) {
      if (err) {
        throw err;
      }
      cb(allPolls);
    });
  }
}

/*
function vote (title, option) {
  Poll.findOneAndUpdate({'title': title}, {'options.name'}, function(err, poll) {
  });
*/

module.exports = {createNewPoll: createNewPoll,
                  viewPolls: viewPolls};
