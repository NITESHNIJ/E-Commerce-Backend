const Category = require('../models/category');
module.exports.getCategoryById = async function (req, res, next) {
    try {
        console.log(req.params);
        const category = await Category.findById(req.params.categoryId);
        req.category=category;
        next();
    }
    catch (err) {
        return res.json(
            {
                error: "Category is not found in db"
            }
        )
    }


}
module.exports.createcategory = async function (req, res) {
    try {
        const category = new Category(req.body);
        await category.save();
        return res.json(category);
    }
    catch (err) {
        return res.json(
            {
                error: `not able to save Category in db ${err}`
            }
        )

    }
}
module.exports.getCategory = function (req, res) {
    return res.json(req.category);

}
module.exports.getAllCategory = function (req, res) 
{
    Category.find({}).exec((err,items)=>
    {
        if(err)
        {
            return res.status(400).json(
                {
                    error:'No Categories found'
                }
            )
        }
        return res.json(items);
    })

}
module.exports.updateCategory=async function(req,res)
{
    const category=req.category;
    category.name=req.body.name;
    try{
    const updatedCategory=await category.save();
    return res.json(updatedCategory);
    }
    catch(err)
    {
        return res.json({
            error:"No category found"
        })
    }

}
module.exports.removeCategory=async function(req,res)
{
    const category=req.category;
    try{
    const updatedCategory=await category.remove();
    return res.json(
        {
            message:`Deleted ${updatedCategory.name} succesfully`
        })
    }
    catch(err)
    {
        return res.json({
            error:"No category found"
        })
    }
}
