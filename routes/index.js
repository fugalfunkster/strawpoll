/* jslint node: true */
'use strict';

var path = process.cwd();

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
      res.render('index.ejs', {user: user});
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
      res.render('mypolls.ejs', {user: req.user.local.email});
    });

  app.route('/new')
    .get(isLoggedIn, function(req, res) {
      res.render('new.ejs', {user: req.user.local.email});
    });

  app.route('/single')
    .get(function(req, res) {
      var user = req.isAuthenticated();
      res.render('single.ejs', {user: user});
    });

};
