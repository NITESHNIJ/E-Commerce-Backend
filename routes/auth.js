const config = require('../config/middleware');
const express = require('express');
const Router = express.Router();
const auth = require('../controllers/auth');

Router.get('/signout', auth.signout);
Router.post('/signup', auth.signup);
Router.post('/signin', auth.signin);
Router.get('/signout', auth.signout);
Router.get('/testroute', auth.isSignedIn, (req, res) => {
    return res.json({
        msg: "User signed in",
        auth: req.auth,
    });
});

module.exports = Router;