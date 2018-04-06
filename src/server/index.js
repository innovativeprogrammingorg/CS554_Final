const SocketHandler = require('./handlers/SocketHandler.js');
const Auth = require('./authentication.js');
const {SERVER_PORT, SESSION_SECRET, SESSION_COOKIE_KEY} = require('../config/constants.js');

var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io')(server);

var cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require("express-session");
	redis = require('redis');

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

var sharedsession = require("express-socket.io-session");

var redisClient = redis.createClient(),
	RedisStore = require('connect-redis')(session),
	redisStore = new RedisStore({ client: redisClient });


app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SESSION_SECRET));

var sessionMiddleware = session({
	store:redisStore,
    key: SESSION_COOKIE_KEY,
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

io.use(sharedsession(sessionMiddleware, {
    autoSave:true
}));


io.use((socket,next)=>{
	var parseCookie = cookieParser(SESSION_SECRET);
	parseCookie(socket.handshake,null,()=>{
		let sessionID = socket.handshake.cookies['cah.sid'];
		redisStore.load(sessionID, function (err, session) {
			if(err){
				next();
			}
			socket.handshake.sessionID = sessionID;
			if(session){
				  socket.handshake.session = session;

			}
            //console.log("SESSION ID IS "+sessionID);
			next();
        });	
	});
	
});



app.post('/create/',(req,res)=>{
	try{
		let username = req.body.username;
		let password = req.body.password;
		Auth.createUser(username,password,(result)=>{
			if(result){
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
  console.log('Final Project listening on port '+SERVER_PORT);
});