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
 * joinedGame: The user has just join a game
 * createGame: The user is attempting to create a game
 * leaveGame: The user is leaving the game
 * startGame: The user is attempting to start a game
 * getPlayers: Request for the players in the current game
 * getSettings: Request for the settings in the current game
 * getZar: Request for the current cardzar
 * updateSetting:
 * updateCardPacks: game cardpacks update
 * playCards:
 * chooseCards:
 * amIOwner: whether or not the player is the owner of the current game
 * amIZar: Am I the card zar?
 * inGame: The user is in a game. Respond with game data for init. Calling socket will be bound to the player.
 * isStarted: Is the game started?
 */

class socketHandler{

	constructor(io){
		this.io = io;
		this.gameHandler = new GameHandler(this.io.of('/'));
		this.start();
	}

	start(){
		this.io.on('connection',(socket)=>{
			//console.log("Received a new connection");
			
			//console.log(socket.handshake.session);

			/*if(!socket.session || !socket.session.username){
				
				console.log("Disconnecting a socket for not being authenticated!");
				socket.disconnect(true);
				return;
			}*/
			//console.log(socket.handshake);
			if(socket.handshake.session && socket.handshake.session.game){
				socket.join(socket.handshake.session.game);
			}
			socket.on('logout',()=>{
				delete socket.handshake.session.game;
				delete socket.handshake.session.username;
				socket.handshake.session.save();
				socket.emit('loggedOut');
			});

			socket.on('login',(cred)=>{
				this.login(socket,cred);
			});
			socket.on('guestLogin',(name)=>{
				this.loginGuest(socket,name);
			});
			socket.on('init',()=>{
				
				socket.emit('session',socket.handshake.sessionID);
			});

			socket.on('joinLobby',()=>{
				this.lobby(socket);
			});
			socket.on('joinGame',(msg)=>{
				this.joinGame(socket,msg);
			});

			socket.on('leaveGame',()=>{
				this.gameHandler.leaveGame(socket);
				
			});

			socket.on('joinedGame',()=>{
				this.gameHandler.joinedGame(socket);
			});
			socket.on('getPlayers',()=>{
				this.gameHandler.getPlayers(socket);
			});
			socket.on('getSettings',()=>{
				this.gameHandler.getSettings(socket);
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
			socket.on('playCards',(cards)=>{
				this.gameHandler.playCards(socket,cards);
			});
			socket.on('chooseCards',(choice)=>{
				this.gameHandler.chooseCards(socket,choice);
			});
			socket.on('amIZar',()=>{
				this.gameHandler.isZar(socket);
			});
			socket.on('amIOwner',()=>{
				this.gameHandler.isOwner(socket);
			});
			socket.on('inGame',()=>{
				this.gameHandler.inGame(socket);
			});
			socket.on('isStarted',()=>{
				this.gameHandler.isStarted(socket);
			});
			socket.on('getZar',()=>{
				this.gameHandler.getZar(socket);
			});
			socket.on('disconnect',()=>{
			});
		});
	}

	lobby(socket){
		socket.join('lobby',()=>{
			this.gameHandler.sendAllGames(socket);
		});
	}

	async joinGame(socket,data){
		console.log("Received:"+data);
		let game_id = data.game_id;
		let password = data.password;
		this.gameHandler.joinGame(socket,game_id,password);
	}

	async login(socket,msg){
		try{
			let username = msg.username;
			let password = msg.password;
			Auth.authUser(username,password,(valid)=>{
				if(valid){
					socket.handshake.session.username = username;
					socket.handshake.session.isGuest = false;
					socket.handshake.session.save();
					socket.emit('login',true);
				}else{
					socket.emit('login',false);
				}
			});
		}catch(err){
			console.error("Error:"+err);
		}
	}

	async loginGuest(socket,guestName){
		console.log("received guest request!");
		try{
			Auth.authGuest(guestName,(valid)=>{
				if(valid){
					socket.handshake.session.username = guestName;
					socket.handshake.session.isGuest = true;
					socket.handshake.session.save();
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