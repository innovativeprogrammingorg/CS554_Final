const Auth = require('../authentication.js');
const GameHandler = require('./GameHandler.js');

class socketHandler{
	constructor(io){
		this.io = io;
		this.gameHandler = new GameHandler(io);
	}
	start(){
		io.on('connection',(socket)=>{
			if(!socket.request.session.username){
				console.log("Disconnecting a socket for not being authenticated!");
				socket.disconnect(true);
				return;
			}
			socket.on('joinLobby',(msg)=>{
				this.lobby(socket);
			});
			socket.on('joinGame',(msg)=>{
				this.joinGame(socket,msg);
			});
			socket.on('createGame',(msg)=>{
				this.gameHandler.createGame(socket);
			});
			socket.on('startGame',(msg)=>{
				this.gameHandler.startGame(socket);
			});
			socket.on('playCards',(msg)=>{
				this.playCards(socket,msg);
			});
			socket.on('chooseCards',(msg)=>{
				this.chooseCards(socket,msg);
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
		let obj = JSON.parse(data);
		let game_id = obj.game_id;
		let password = obj.password;
		this.gameHandler.joinGame(socket,game_id,password);
	}

	async playCards(socket,msg){
		let cards = JSON.parse(msg);
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