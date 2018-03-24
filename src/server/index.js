var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);



app.get('/',(req,res)=>{

});

app.get('/games',(req,res)=>{

});

app.post('/login',(req,res)=>{

});

app.post('/login/guest',(req,res)=>{

});

app.get('/game/:id',(req,res)=>{

});

app.listen(8989, function () {
  console.log('Assignment 4 listening on port 8989!');
});