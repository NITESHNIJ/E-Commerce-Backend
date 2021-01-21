module.exports.validator=function(req,res,next)
{
    if(req.body.password.length<4)
    {
        return res.status(422).json(
            {
                Error:"Enter valid Password"
            }
        );
    }
    next();
}