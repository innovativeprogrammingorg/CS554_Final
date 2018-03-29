import User from './objects/user.js';
import Authentication as Auth from './authenication.js';

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var RedisStore = require("connect-redis")(session);

app.use(cookieParser());
app.use( bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
  extended: true
})); 

app.use(session({ secret: "cats",resave: true,saveUninitialized: true}));

var sessionMiddleware = session({
    store: new RedisStore({}), // XXX redis server config
    secret: "keyboard cat",
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);


/**
 * Ajax handling
 */


app.post('/login',(req,res)=>{
	try{
		let username = req.body.username;
		let password = req.body.password;
		Auth.authUser(username,password,(valid)=>{
			if(valid){
				res.status(200).send("VALID");
			}else{
				res.status(403).send("INVALID");
			}
		});
	}catch(err){
		res.status(400).send("ERROR");
	}
});

app.post('/login/guest',(req,res)=>{

});

app.listen(8989, function () {
  console.log('Assignment 4 listening on port 8989!');
});s