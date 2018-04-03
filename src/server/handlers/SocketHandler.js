const Auth = require('../authentication.js');
const GameHandler = require('./GameHandler.js');

/**
 * +++++++++++++++++++EVENTS++++++++++++++++++++
 * logout: The user is requesting to be logged off
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
 */
class socketHandler{

	constructor(io){
		this.io = io;
		this.gameHandler = new GameHandler(io);
		this.start();
	}

	start(){
		io.on('connection',(socket)=>{
			if(!socket.request.session.username){
				console.log("Disconnecting a socket for not being authenticated!");
				socket.disconnect(true);
				return;
			}
			socket.on('logout',()=>{
				socket.request.session.game = undefined;
				socket.request.session.username = undefined;
				socket.emit('loggedOut','You have been logged out successfully');
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
		if(socket.request.session.game){
			this.gameHandler.leaveGame(socket);
		}
	}

}

module.exports = socketHandler;