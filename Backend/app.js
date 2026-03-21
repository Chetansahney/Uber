const dotenv=require('dotenv');
dotenv.config();
const cors=require('cors');
const express = require('express');


const app= express();
app.use(cors());//jab hume apne domain se request aaegi toh yaha pe cors ke andr hum domain name daaldenge taaki aur kisi donmain se request accept na hoye


app.get('/',(req,res)=>{
    res.send("Hello World");
});



module.exports = app;// to use this app in anyu other files we want