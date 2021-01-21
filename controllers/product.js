const Product = require('../models/product');
const formidable=require('formidable');
const fs=require('fs');
const _=require('lodash');
module.exports.getProductByid = async function (req, res, next) {
    try 
    {
        console.log('in product con')
        const product = await (await Product.findById(req.params.productId)).execPopulate("category");
        req.product=product;
        next();
    }
    catch (err) {
        return res.json
            ({
                error: "No product found"
            });
    }
}
module.exports.createProduct=function(req,res)
{
    console.log('IN CREATE PRODUCT CONTROLLER');
    let form=new formidable.IncomingForm();
    //keep files extensions
    form.keepExtensions=true;
    form.parse(req,function(err,fields,file)
    {
        if(err)
        {
            return res.status(400).json(
                {
                    error:"problem with file"
                }
            )
        }
        const {name,description,price,category,stock}=fields;
        
        let product=new Product(fields);
        if(!name || !description || !price || !category || !stock)
        {
            return res.status(400).json(
                {
                    error:'All the fields are necessary'
                }
            );
        }

        //handle file here
        if(file.photo)
        {
            if(file.photo.size>3000000)
            {
                return res.status(400).json(
                    {
                        error:"File size too big"
                    }
                );
            }
            product.photo.data=fs.readFileSync(file.photo.path);
            product.photo.contentType=file.photo.type;
            
        }
        product.save(function(err,product)
        {
            if(err)
            {
                return res.status(400).json({
                    error:"Error in Saving product to DB"
                });
            }
            return res.json(product);
        });
    });


}
module.exports.getProduct=function(req,res)
{
    req.product.photo=undefined;
    return res.json(req.product);
}
//middleware
module.exports.photo=function(req,res,next)
{
    if(req.product.photo.data)
    {
       res.set("Content-Type",req.product.photo.contentType);
       return res.send(req.product.photo.data);
    }
    next();
}
module.exports.deleteProduct=async function(req,res)
{
    let product=req.product;
    try{
        let deletedP=await product.remove();
        return res.json(
            {
                msg:`Deleted ${deletedP.name} succesfully`
            }
        );

    }
    catch(err)
    {
        return res.status(400).json(
            {
                error:"failed to remove from db"
            }
        )
    }

}
module.exports.updateProduct=function(req,res)
{
    console.log('int update product');
    let form=new formidable.IncomingForm();
    //keep files extensions
    form.keepExtensions=true;
    form.parse(req,function(err,fields,file)
    {
        if(err)
        {
            console.log('error in updateproduct server function 1');
            return res.status(400).json(
                {
                    error:"problem with file"
                }
            )
        }
        const {name,description,price,category,stock}=fields;
        
        let product=req.product;
        if(!name || !description || !price || !category || !stock)
        {
            console.log('error in updateproduct server functionb 2');
            return res.status(400).json(
                {
                    error:'All the fields are necessary'
                }
            );
        }

        //handle file here
        if(file.photo)
        {
            if(file.photo.size>3000000)
            {
                console.log('error in updateproduct server function 3');
                return res.status(400).json(
                    {
                        error:"File size too big"
                    }
                );
            }
            product.photo.data=fs.readFileSync(file.photo.path);
            product.photo.contentType=file.photo.type;
            
        }
        product.name=name;
        product.category=category;
        product.price=price;
        product.description=description;
        product.stock=stock;
        product.save(function(err,product)
        {
            
            if(err)
            {
                console.log('error in updateproduct server function 4');
                return res.status(400).json({
                    error:"Error in Updating product"
                });
            }
            return res.json(product);
        });
    });


}
module.exports.getAllproducts=async function(req,res)
{
    try{
        //select is used as -->if we don't want our photo with the document then we will give a - with the name
        //of the field we want to avoid sending 
        let limit=req.query.limit ? parseInt(req.query.limit):8;
        let sortBy=req.query.sortBy ? req.query.sortBy:"_id";
       let products=await Product.find({}).select("-photo").limit(limit).populate("category").sort([[sortBy,"asc"]]);
    return res.json(products);
    }
    catch(err)
    {
    return res.json(
        {
            msg:"No Products Found"
        }
    );
    }

}
//TODO:COMEBACK HERE some dbts
module.exports.getAllUniqueCategories=function(req,res)
{
    Product.distinct("category",{},(err,category)=>
    {
        if(err)
        {
            return res.status(400).json(
              {
                  error:"No Category Found"
              }
            );
        }
        return res.json(category);

    });


}
module.exports.updateStock=function(req,res,next)
{
    //getting all products from cart
    let myoperations=req.body.order.products.map(prod,function()
    {
        return {
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock:-prod.count,sold:+prod.count}}
            }
        }
    });

    Product.bulkWrite(myoperations,{},(err,products)=>{
        if(err)
        {
        return res.json({
            error:"Bulk operations failed"
        });
        }
        next();
    });
}