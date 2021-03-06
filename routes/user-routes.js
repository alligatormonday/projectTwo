// Requiring our models and passport as we've configured it
const db = require('../models');
const passport = require('../config/passport');

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post('/auth/login', passport.authenticate('local'), (req, res) => {
    console.log('From login handler');
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      username: req.user.username,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/auth/signup', (req, res) => {
    console.log('From sign-up handler');
    db.User.create({
      username: req.body.username,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, '/auth/login');
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get('/auth/logout', (req, res) => {
    console.log('from logout handler');
    req.logout();
    res.redirect('/');
  });

  // Route for getting some data about our user to be used client side
  app.get('/api/user_data', (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        username: req.user.username,
        id: req.user.id
      });
    }
  });

  app.get('/api/users', function (req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Question
    db.User.findAll({
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  app.get('/api/users/:id', function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Question
    db.User.findOne({
      where: {
        id: req.params.id
      },
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

};
