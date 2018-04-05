const SocketHandler = require('./handlers/SocketHandler.js');
const Auth = require('./authentication.js');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {origins:'http://localhost:* localhost:*'});

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var RedisStore = require("connect-redis")(session);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE');
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
    cookie: false
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request,socket.request.res, next);
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
				req.session.username = username;
				req.session.isGuest = false;
				res.status(200).send("VALID");
			}else{
				res.status(200).send("INVALID");
			}
		});
	}catch(err){
		console.error(err);
		res.status(400).send("ERROR");
	}
});

app.post('/login/guest',(req,res)=>{
	console.log("received guest request!");
	try{
		let guestName = req.body.username;
		Auth.authGuest(guestName,(valid)=>{
			if(valid){
				req.session.username = guestName;
				req.session.isGuest = true;
				res.status(200).send("VALID");
			}else{
				res.status(200).send("INVALID");
			}
		});
	}catch(err){
		console.error(err);
		res.status(400).send("ERROR");
	}
});

app.post('/create/',(req,res)=>{
	try{
		let username = req.body.username;
		let password = req.body.password;
		Auth.createUser(username,password,(result)=>{
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



server.listen(8989, function () {
  console.log('Final Project listening on port 8989!');
});