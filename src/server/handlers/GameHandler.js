const GameManager = require('../../objects/GameManager.js');

/**
 * Events
 * full
 * room
 * games: send all games
 * game: new game has been created
 * start
 * error
 * joinedGame: redirect the user to the game
 * joined
 * promptPassword: when the game requires a password
 * incorrectPassword
 * left: when player leaves the game
 * played: A player played their cards for the round
 * iPlayed: The user played their cards for the round
 * allPlayed: All played have played their cards for the round
 */
class GameHandler{

	constructor(io){
		this.io = io;
		let callbacks = {
			onMaxCapacity:this.onServerFull,
			onSpaceAvailible:this.onServerHasRoom,
			onGameStart:this.onGameStart,
			onGameCreate:this.onGameCreate,

			game:{
				onAllUsersPlayed:this.onAllUsersPlayed,
				onPlayerWin:undefined,
				onOutOfCards:undefined,
				onPlayerLeave:this.onPlayerLeft
			}

		};
		this.gameManager = new GameManager(callbacks);
	}

	async onServerFull(){
		this.io.in('lobby').emit('full','Lobby is full!');
	}

	async onServerHasRoom(){
		this.io.in('lobby').emit('room','Room for more games!');
	}

	async onGameCreate(game){
		this.io.in('lobby').emit('game',JSON.stringify(game));
	}

	async onGameStart(game_id){
		this.io.in(game_id).emit('start','Game has started!');
	}

	async onAllUsersPlayed(game_id){
		this.io.in(game_id).emit('allPlayed','Time for the zar to choose the winner');
	}

	async onPlayerLeft(game_id,username){
		this.io.in(game_id).emit('left',username);
	}


	async sendAllGames(socket){
		let games = JSON.stringify(this.gameManager.games.toArray());
		socket.emit('games',games);
	}

	async joinGame(socket,game_id,password=""){
		let game = this.gameManager.getGame(game_id);
		if(game === null){
			socket.emit('error','Game does not exist');
			return;
		}
		if(!game.hasRoom()){
			socket.emit('error','Game is full!');
			return;
		}

		if(password === game.settings.password){
			socket.request.session.game = game_id;//Auth the player for the game
			socket.emit('joinedGame','Correct Password');
			game.addPlayer(socket.request.session.username)
			socket.to(game_id).emit('joined',socket.request.session.username);
		}else if(password === ""){
			socket.emit('promptPassword','This game requires a password');
		}else{
			socket.emit('incorrectPassword','Incorrect Password!');
		}
	}

	async leaveGame(socket){
		let game = this.gameManager.getGame(socket.request.session.game);
		socket.request.session.game = null;
		let username = socket.request.session.username;
		if(game === null){
			console.log("Error, user left a game which does not exist");
			return;
		}

		game.removePlayer(username);
	}

	async playCards(socket,cards){
		let game_id = socket.request.session.game;
		let username = socket.request.session.username;
		if(game_id == null){
			socket.emit('error','You are not in a game!');
			return;
		}
		let game = this.gameManager.getGame(game_id);
		if(game === null){
			console.log('User tried to play in a game which does not exist');
			socket.emit('error','Please rejoin the game. Error: Game not defined');
			return;
		}
		let played = JSON.stringify(game.playCards(username,cards));
		socket.to(game_id).emit('played',played);
		socket.emit('iPlayed',played);
	}
}