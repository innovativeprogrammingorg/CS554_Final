const SocketHandler = require('./handlers/SocketHandler.js');
const Auth = require('./authentication.js');
const {SERVER_PORT, SESSION_SECRET, SESSION_COOKIE_KEY} = require('../config/constants.js');
var app = require('express')();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var methodOverride = require('method-override')


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

var sharedsession = require("express-socket.io-session");

var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(session);
var redisStore = new RedisStore({ client: redisClient });


app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SESSION_SECRET));

var sessionMiddleware = session({
    key: SESSION_COOKIE_KEY,
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

io.use(sharedsession(sessionMiddleware, {
    autoSave:true
}));




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
var socketHandler =  new SocketHandler(io);



server.listen(SERVER_PORT, function () {
  console.log('Final Project listening on port 8989!');
});