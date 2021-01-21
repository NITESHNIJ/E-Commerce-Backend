require('dotenv').config();
const express=require('express');
const app=express();
const port=1000;
const bodyparser=require('body-parser');
const cookieparser=require('cookie-parser');
const cors=require('cors');



//DB Connection
const mongoose=require('mongoose');
mongoose.connect(process.env.DATABASE,{ useNewUrlParser: true,useUnifiedTopology: true});
const db=mongoose.connection;
db.on('error',console.error.bind(console,'error connecting to db'));
db.once('open',function()
{
    console.log('connection to dbase succes');
});


//middlewares
app.use(bodyparser.json());
app.use(cookieparser());
app.use(cors());

//routes
const userRoutes=require('./routes/user');
const authRoutes=require('./routes/auth');
app.use("/api",userRoutes);
app.use("/api",authRoutes);
app.use("/api",require('./routes/category'));
app.use("/api",require('./routes/product'));



app.listen(port,function(err)
{
    if(err)
    {
        console.log(`error in running server ${err}`);
    }
    console.log(`sevrer is up and running on port:${port}`);
});