const Auth = require('../authentication.js');
const LobbyHandler = require('./LobbyHandler.js');
const GameHandler = require('./GameHandler.js');

class socketHandler{
	constructor(io){
		this.io = io;

		this.gameHandler = new GameHandler(io);
		this.lobbyHandler = new LobbyHandler(io);
	}
	start(){
		io.on('connection',(socket)=>{
			socket.on('joinLobby',(msg)=>{
				this.lobby(socket);
			});
			socket.on('joinGame',(msg)=>{

			});
		});
	}
	lobby(socket){
		socket.join('lobby',()=>{
			socket.emit()
		});
	}

	joinGame(){
		
	}

}










module.exports = socketHandler;