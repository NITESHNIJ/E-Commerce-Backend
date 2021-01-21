const mongoose=require('mongoose');
const ProductCartSchema=new mongoose.Schema
(
    {
        product:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        name:String,
        count:Number,
        price:Number
    }
);
const ProductCart=mongoose.model("ProductCart",ProductCartSchema);
const OrderSchema=new mongoose.Schema
(
    {
        products:[ProductCartSchema],
        transaction_id:{},
        amount:Number,
        address:String,
        updated:Date,
        user:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }


    }
);
const Order=mongoose.model("Order",OrderSchema);
module.exports={Order,ProductCart};