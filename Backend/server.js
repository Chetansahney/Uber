const http=require('http');//built in http module is getting used to create a server
const app=require('./app');//yeh hum yaha pe use kar paa rahe hai because of module.exports in app.js file
const port=process.env.PORT || 3000;

const server=http.createServer(app);
server.listen(port,()=>console.log(`Server is running on port ${port}`));