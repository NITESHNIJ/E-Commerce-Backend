const User=require('../models/user');
const Order=require('../models/order');

//will setup the userprofile in req
module.exports.getUserbyId=function(req,res,next)
{
    console.log("In user Conteoller"+req.params.userId);
    User.findById(req.params.userId).exec(function(err,user)
    {
        if(err || !user)
        {
            return res.status(400).json(
                {
                    error:"No user was found in db"
                }
            )
        }
         req.profile=user;
         next();
    }
    );
    
}
module.exports.getUser=function(req,res)
{
    //TODO:get back here for password
    return res.json(req.profile);
}
module.exports.updateUser=async function(req,res)
{
    console.log(req.body);
    try
    {
    const user=await User.findById(req.profile._id);
    user.name=req.body.name;
    await user.save();
    return res.json
    (
        {
            user:user
        }
    )
    }
    catch(err)
    {
        return res.status(400).json(

            {
                error:"You are not authorized to do this"
            }
        )
    }

}
//assignment
module.exports.getallusers=async function(req,res)
{
    try{
    const users=await User.find({});
    return res.json(
        {
            user:users
        }
    )




    }
    catch(err)
    {
        return res.json(
            {
                error:"Error in getting all users from db"
            }
        )
    }
}
module.exports.userPurchaseList=async function(req,res)
{
    try{
    const order=await Order.find({user:req.profile._id}).populate("user","_id name email");
    return res.json(order);

    }
    catch(err)
    {
        return res.json
        (
            {
                error:"no order in this account"
            });
        }
}
module.exports.pushOrderinpurchaselist=async function(req,res,next)
{
    let purchases=[];
    req.body.order.products.forEach(product=>
        {
            purchases.push(
                {
                _id:product._id,
                name:product.name,
                description:product.description,
                category:product.category,
                quantity:product.quantity,
                amount:req.body.order.amount,
                transaction_id:req.body.order.transaction_id,
               });

        });
        //storing in db
        // new as true means return us the updated object from db

        try
        {
        const user=await User.findOneAndUpdate({_id:req.profile._id},{$push:{purchases:purchases}},{new:true});
        }
        catch(err)
        {
            return res.status(400).json(
                {
                    error:"unable to update purchase list"
                }
            )
        }
    next();


}