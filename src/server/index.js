const SocketHandler = require('./handlers/SocketHandler.js');
const Auth = require('./authentication.js');

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

//app.use(session({ secret: "4wehjgwegfwkw3k23",resave: true,saveUninitialized: true}));

var sessionMiddleware = session({
    store: new RedisStore({}), // XXX redis server config
    secret: "4wehjgwegfwkw3k23",
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

var socketHandler =  new SocketHandler(io);

/**
 * Ajax handling
 */
Auth.init();

app.post('/login',(req,res)=>{
	try{
		let username = req.body.username;
		let password = req.body.password;
		Auth.authUser(username,password,(valid)=>{
			if(valid){
				req.session.username = username;
				req.session.isGuest = false;
				res.status(200).send("VALID");
			}else{
				res.status(403).send("INVALID");
			}
		});
	}catch(err){
		console.log(err);
		res.status(400).send("ERROR");
	}
});

app.post('/login/guest',(req,res)=>{
	try{
		let guestName = req.body.username;
		Auth.authGuest(guestName,(valid)=>{
			if(valid){
				req.session.username = guest_name;
				req.session.isGuest = true;
				res.status(200).send("VALID");
			}else{
				res.status(403).send("INVALID");
			}
		});
	}catch(err){
		console.log(err);
		res.status(400).send("ERROR");
	}
});

/**
 * Socket Handler
 */



app.listen(8989, function () {
  console.log('Assignment 4 listening on port 8989!');
});