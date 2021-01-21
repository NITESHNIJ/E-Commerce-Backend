const express = require('express');
const Router = express.Router();

const categorycontroller = require('../controllers/category');

const authcontoller = require('../controllers/auth');
const usercontroller = require('../controllers/user');

Router.post
    ('/category/create/:userId',
        usercontroller.getUserbyId,
        authcontoller.isSignedIn,
        authcontoller.isAuthenticated,
        authcontoller.isAdmin,
        categorycontroller.createcategory
    );
    
//get
Router.get('/category/:categoryId',categorycontroller.getCategoryById, categorycontroller.getCategory);
Router.get('/categories',categorycontroller.getAllCategory);

//update
Router.put
    ('/category/:categoryId/:userId',
        usercontroller.getUserbyId,
        authcontoller.isSignedIn,
        authcontoller.isAuthenticated,
        authcontoller.isAdmin,
        categorycontroller.getCategoryById,
        categorycontroller.updateCategory
    );

//delete
Router.delete
    ('/category/:categoryId/:userId',
        usercontroller.getUserbyId,
        authcontoller.isSignedIn,
        authcontoller.isAuthenticated,
        authcontoller.isAdmin,
        categorycontroller.getCategoryById,
        categorycontroller.removeCategory
    );



module.exports = Router;