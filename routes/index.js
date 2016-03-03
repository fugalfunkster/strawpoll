/* jslint node: true */
'use strict';

var path = process.cwd();
var pollController = require('../controllers/pollController');

module.exports = function(app, passport) {

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  app.route('/')
    .get(function(req, res) {
      var user = req.isAuthenticated();
      pollController.viewPolls(null, null, function(polls) {
        res.render('index.ejs', {user: user, polls: polls});
      });
    });

  app.route('/login')
    .get(function(req, res) {
      res.render('login.ejs', {message: req.flash('loginMessage')});
    })
    .post(passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }));

  app.route('/signup')
    .get(function(req, res) {
      res.render('signup.ejs', {message: req.flash('signupMessage')});
    })
    .post(passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
    }));

  app.route('/profile')
    .get(isLoggedIn, function(req, res) {
      console.log(req.user);
      res.render('profile.ejs', {user: req.user.local.email});
    });

  app.route('/oauth/github')
    .get(passport.authenticate('github'));

  app.route('/oauth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/logout')
    .get(function(req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/mypolls')
    .get(isLoggedIn, function(req, res) {
      pollController.viewPolls(req.user._id, null, function(myPolls) {
        res.render('myPolls.ejs', {polls: myPolls});
      });
    });

  app.route('/new')
    .get(isLoggedIn, function(req, res) {
      console.log(req.user._id);
      res.render('new.ejs', {user: req.user.local.email});
    })
    .post(function(req, res) {
      pollController.createNewPoll(req.user._id,
                                   req.body.title,
                                   req.body.options);
      res.redirect('/');
    });

  app.route('/single/:id')
    .get(function(req, res) {
      var user = req.isAuthenticated();
      var id = req.params.id;
      pollController.viewPolls(null, id, function(poll) {
        res.render('single.ejs', {user: user, poll: poll[0]});
      });
    });

  app.route('/:id')
    .get(function(req, res) {
      var id = req.params.id;
      pollController.viewPolls(null, id, function(poll) {
        res.send(poll);
      });
    });

  app.route('/vote')
    .post(function(req, res) {
      pollController.vote(req.body);
      res.redirect('/');
    });

  app.route('/delete/:id')
    .post(isLoggedIn, function(req, res) {
      var pollId = req.params.id;
      var userId = req.user._id;
      pollController.deletePoll(pollId, userId, function() {
        res.redirect('/mypolls');
      });
    });

};
