const SocketHandler = require('./handlers/SocketHandler.js');
const Auth = require('./authentication.js');
const {SERVER_PORT, SESSION_SECRET, SESSION_COOKIE_KEY} = require('../config/constants.js');
var app = require('express')();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

//var RedisStore = require("connect-redis")(session);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
var sharedsession = require("express-socket.io-session");

var sessionStore = new session.MemoryStore();

var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(io,sessionStore, cookieParser(SESSION_SECRET));


app.use(allowCrossDomain);
app.use(cookieParser(SESSION_SECRET));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
  extended: true
})); 


app.use(session({ secret: SESSION_SECRET, store: sessionStore }));

var sessionMiddleware = session({
    key: SESSION_COOKIE_KEY,
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
});


/*io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});*/
/*io.use(sharedsession(sessionMiddleware, {
    autoSave:true
}));*/



/**
 * Ajax handling
 */


app.post('/create/',(req,res)=>{
	try{
		let username = req.body.username;
		let password = req.body.password;
		Auth.createUser(username,password,(result)=>{
			if(result){
				req.session.username = username;
				req.session.isGuest = false;
				req.session.save();
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
var socketHandler =  new SocketHandler(sessionSockets);



server.listen(8989, function () {
  console.log('Final Project listening on port 8989!');
});