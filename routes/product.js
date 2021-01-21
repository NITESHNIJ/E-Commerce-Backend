const express=require('express');
const Router=express.Router();
const productController=require('../controllers/product');
const authController=require('../controllers/auth');
const userController=require('../controllers/user');

Router.post("/product/create/:userId",
userController.getUserbyId,
authController.isSignedIn,
authController.isAuthenticated,
authController.isAdmin,
productController.createProduct
);
//TODO:--> create delete product controller
Router.get('/products',productController.getAllproducts);
Router.get('/product/:productId',productController.getProductByid,productController.getProduct);

Router.get('/product/photo/:productId',productController.getProductByid,productController.photo);

//DELETE ROUTE
Router.delete('/product/:productId/:userId',
userController.getUserbyId,
authController.isSignedIn,
authController.isAuthenticated,
authController.isAdmin,
productController.getProductByid,
productController.deleteProduct);

//PUT ROUTE
Router.put('/product/:productId/:userId',
userController.getUserbyId,
authController.isSignedIn,
authController.isAuthenticated,
authController.isAdmin,
productController.getProductByid,
productController.updateProduct);

Router.get('/products/categories',productController.getAllUniqueCategories);
module.exports=Router;