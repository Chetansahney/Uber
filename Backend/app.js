const dotenv=require('dotenv');
dotenv.config();
const cors=require('cors');
const express = require('express');
const app= express();
const connectToDB=require('./db/db');
connectToDB();
const userRoutes=require('./routes/users.routes');
const cookieParser=require('cookie-parser');
const captainRoutes=require('./routes/captain.routes');

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(cors());//jab hume apne domain se request aaegi toh yaha pe cors ke andr hum domain name daaldenge taaki aur kisi donmain se request accept na hoye

app.use(cookieParser());//to parse the cookies from the request headers and make it available in req.cookies object

app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.use('/users',userRoutes);//yaha pe humne userRoutes ko use kiya hai taaki jab bhi /users route pe request aayegi toh yeh userRoutes ke andar jaake dekhega ki waha pe konsa route match ho raha hai aur uske according response dega

app.use('/captains',captainRoutes);//yaha pe humne captainRoutes ko use kiya hai taaki jab bhi /captains route pe request aayegi toh yeh captainRoutes ke andar jaake dekhega ki waha pe konsa route match ho raha hai aur uske according response dega


module.exports = app;// to use this app in anyu other files we want