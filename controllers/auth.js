const User=require('../models/user');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
module.exports.signout=function(req,res)
{
    res.clearCookie("token");
    res.json(
        {
            message:"User Signed Out"
        }
    );
}
module.exports.signup=async function(req,res)
{
    try
    {
    const user=await User.create(req.body);

    return res.json(
        {
            Name:user.name,
            email:user.email,
            id:user._id
        }
    );
    }
    catch(err)
    {
        console.log(`Error in signup-auth.js:${err}`);
        return res.status(400).json
        (
            {
                error:`Not able to save in DB ${err}`
            }
        );
    }
}
module.exports.signin=async function(req,res)
{
    
    try
    {
    let Email=req.body.email;
    let password=req.body.password;
    console.log(req.body);
    console.log(Email);
    const user=await User.findOne({email:Email});
    //console.log(user);
    if(!user)
    {
        return res.status(400).json(
            {
                error:"User Email does not exist in db"
            }
        )
    }
    if(!user.authenticate(password))
    {
         return res.status(401).json(
             {
                 error:"Email and password do not match"
             }
         );

    }
    //creating a token
    const token=jwt.sign({_id:user._id},process.env.SECRET,{expiresIn:1000000});
    //putting token into cookie
    //cookie is just like a key value pair
    res.cookie("token",token);

    //send response to frontend
    const {_id,name,email,role}=user;
    return res.json(
        {
            token,
            user:{_id,name,email,role}
        }
    );


    }
    catch(err)
    {
       console.log(`error in signing in:${err}`);
       return res.status(400).json(
           {
               error:"User Email does not exist"
           }
       )
    }


}
//protected routes
module.exports.isSignedIn=expressJwt({
        secret:process.env.SECRET,
        userProperty:"auth"
    });
//custom middlewares
module.exports.isAuthenticated=function(req,res,next)
{
    //req.profile will be set up by the frontend part
    //req.auth will be set up by the isSignedIn mware
    let checker =req.profile && req.auth && req.auth._id==req.profile._id;
    if(!checker)
    {
        return res.status(403).json
        (
            {
                error:"ACCCES DENIED"
            }
        )
    }
    next();
}


module.exports.isAdmin=function(req,res,next)
{
    if(req.profile.role===0)
    {
        return res.status(403).json({
            error:"You are not an admin"
        });
    }
    next();
}