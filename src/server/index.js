const SocketHandler = require('./handlers/SocketHandler.js');
const Auth = require('./authentication.js');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var RedisStore = require("connect-redis")(session);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(cookieParser());
app.use( bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
  extended: true
})); 
app.use(allowCrossDomain);
//app.use(session({ secret: "4wehjgwegfwkw3k23",resave: true,saveUninitialized: true}));

var sessionMiddleware = session({
    store: new RedisStore({}), // XXX redis server config
    secret: "4wehjgwegfwkw3k23",
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

Auth.manual();


/**
 * Ajax handling
 */
//Auth.init();

app.post('/login',(req,res)=>{
	console.log("received a login request");
	try{
		let username = req.body.username;
		let password = req.body.password;
		Auth.authUser(username,password,(valid)=>{
			console.log("Finished auth user test...");
			if(valid){
				req.session.username = username;
				req.session.isGuest = false;
				res.status(200).send("VALID");
			}else{
				res.status(200).send("INVALID");
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
				res.status(200).send("INVALID");
			}
		});
	}catch(err){
		console.log(err);
		res.status(400).send("ERROR");
	}
});

app.post('/create/',(req,res)=>{
	try{
		let username = req.body.username;
		let password = req.body.password;
		Auth.createUser(username,password,(result)=>{
			console.log("Sending response to create account request!");
			if(result){
				req.session.username = username;
				req.session.isGuest = false;
				res.status(200).send("VALID");
			}else{
				res.status(200).send("INVALID");
			}
		});
	}catch(err){
		console.log(err);
		res.status(400).send("Error");
	}
});

/**
 * Socket Handler
 */
var socketHandler =  new SocketHandler(io);


app.listen(8989, function () {
  console.log('Assignment 4 listening on port 8989!');
});