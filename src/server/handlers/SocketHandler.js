const Auth = require('../authentication.js');
const GameHandler = require('./GameHandler.js');

/**
 * +++++++++++++++++++EVENTS++++++++++++++++++++
 * login: The user is trying to log in
 * guestLogin: The user is trying to login in as a guest
 * logout: The user is handshakeing to be logged off
 * loggedOut: The user has been logged off
 * joinLobby: The user enters the lobby
 * joinGame: The user is attempting to join a game
 * createGame: The user is attempting to create a game
 * startGame: The user is attempting to start a game
 * updateSetting:
 * updateCardPacks: game cardpacks update
 * playCards:
 * chooseCards:
 * amIOwner: whether or not the player is the owner of the current game
 * inGame: The user is in a game. Respond with game data for init. Calling socket will be bound to the player.
 */

class socketHandler{

	constructor(io){
		this.io = io;
		this.gameHandler = new GameHandler(io);
		this.start();
	}

	start(){
		this.io.on('connection',(err,socket,session)=>{
			console.log("Received a new connection");
			
			//console.log(socket);

			/*if(!socket.session || !socket.session.username){
				
				console.log("Disconnecting a socket for not being authenticated!");
				socket.disconnect(true);
				return;
			}*/
			console.log(session);
			socket.on('logout',()=>{
				session.game;
				session.username;
				session.save();
				socket.emit('loggedOut','You have been logged out successfully');
			});

			socket.on('login',(cred)=>{
				this.login(socket,session,cred);
			});
			socket.on('guestLogin',(name)=>{
				this.loginGuest(socket,session,name);
			});

			socket.on('joinLobby',()=>{
				this.lobby(socket);
			});
			socket.on('joinGame',(msg)=>{
				this.joinGame(socket,msg);
			});
			socket.on('createGame',()=>{
				this.gameHandler.createGame(socket);
			});
			socket.on('updateSetting',(msg)=>{
				this.gameHandler.updateSettings(socket,msg);
			});
			socket.on('updateCardPacks',(msg)=>{
				this.gameHandler.updateCardPacks(socket,msg);
			});
			socket.on('startGame',()=>{
				this.gameHandler.startGame(socket);
			});
			socket.on('playCards',(msg)=>{
				this.playCards(socket,msg);
			});
			socket.on('chooseCards',(msg)=>{
				this.chooseCards(socket,msg);
			});
			socket.on('amIOwner',()=>{
				this.gameHandler.isOwner(socket);
			});
			socket.on('inGame',()=>{
				this.gameHandler.inGame(socket);
			});
			socket.on('disconnect',()=>{
				this.disconnect(socket);
			});
		});
	}

	lobby(socket){
		socket.join('lobby',()=>{
			this.gameHandler.sendAllGames(socket);
		});
	}

	async joinGame(socket,data){
		let game_id = data.game_id;
		let password = data.password;
		this.gameHandler.joinGame(socket,game_id,password);
	}

	async playCards(socket,cards){
		this.gameHandler.playCards(socket,cards);
	}

	async chooseCards(socket,msg){
		this.gameHandler.chooseCards(socket,parseInt(msg));
	}

	async disconnect(socket){
		if(socket.session.game){
			this.gameHandler.leaveGame(socket);
		}
	}

	async login(socket,session,msg){
		try{
			let username = msg.username;
			let password = msg.password;
			Auth.authUser(username,password,(valid)=>{
				if(valid){
					session.username = username;
					session.isGuest = false;
					session.save();
					socket.emit('login',true);
				}else{
					socket.emit('login',false);
				}
			});
		}catch(err){
			console.error("Error:"+err);
		}
	}

	async loginGuest(socket,session,guestName){
		console.log("received guest request!");
		try{
			Auth.authGuest(guestName,(valid)=>{
				if(valid){
					session.username = guestName;
					session.isGuest = true;
					session.save();
					socket.emit('guestLogin',true);
				}else{
					socket.emit('guestLogin',false);
				}
			});
		}catch(err){
			console.log("Error:"+err);
		}
	}
}

module.exports = socketHandler;