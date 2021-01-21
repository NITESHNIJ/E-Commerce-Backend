const express = require('express');
const Router = express.Router();
const userController = require('../controllers/user');
const authContoller = require('../controllers/auth');
Router.get('/user/getalluser', userController.getallusers);
Router.get('/user/:userId', userController.getUserbyId, authContoller.isSignedIn, authContoller.isAuthenticated, userController.getUser);
//update user route
Router.put('/user/:userId', userController.getUserbyId, authContoller.isSignedIn, authContoller.isAuthenticated, userController.updateUser);
Router.put('orders/user/:userId', userController.getUserbyId, authContoller.isSignedIn, authContoller.isAuthenticated, userController.userPurchaseList);
module.exports = Router;