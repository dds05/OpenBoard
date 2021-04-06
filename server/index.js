const express=require("express");
const server=express();

server.use(express.static("public"));


server.listen(3000,function(){
    console.log('server is running at port 3000');
});


  