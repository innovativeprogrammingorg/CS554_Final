const GameManager = require('../../objects/GameManager.js');

/**
 * Events
 * full: the server does not have room for more games
 * room: server has room for more games
 * games: send all games
 * game: new game has been created
 * removeGame: game has been removed
 * createdGame: user created a game successfully
 * start: game has started
 * error: there was an error
 * joinedGame: redirect the user to the game
 * joined: a new player has joined the game
 * promptPassword: when the game requires a password
 * incorrectPassword: when the password enter is incorrect
 * left: when player leaves the game
 * played: A player played their cards for the round
 * iPlayed: The user played their cards for the round
 * allPlayed: All played have played their cards for the round
 * winner: someone has won the game
 * gameDraw: no one can win the game
 * nextRound: Game is entering the next round
 * noZarChoice: Card Zar choice timed out
 * drawCards: when the player draws new cards
 */
class GameHandler{

	constructor(io){
		this.io = io;
		let callbacks = {
			onMaxCapacity:this.onServerFull,
			onSpaceAvailible:this.onServerHasRoom,
			onGameStart:this.onGameStart,
			onGameCreate:this.onGameCreate,
			onGameRemoved: this.onGameRemoved,
			onGameStartFailed:this.onGameStartFailed,
			game:{
				onAllUsersPlayed:this.onAllUsersPlayed,
				onPlayerWin:this.onPlayerWin,
				onOutOfCards:this.onGameOutOfCards,
				onPlayerLeave:this.onPlayerLeft,
				onRoundWon:this.onRoundWon,
				onNextRound:this.onNextRound,
				onCardZarTimeOut:this.CardZarTimeOut
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

	async onGameRemoved(game_id){
		this.io.in('lobby').emit('removeGame',game_id);
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

	async onPlayerWin(game_id,winner){
		this.io.in(game_id).emit('winner',username);
	}

	async onGameOutOfCards(game_id){
		this.io.in(game_id).emit('gameDraw','No more cards left, game is a draw!');
	}

	async onRoundWon(game_id,username){
		this.io.in(game_id).emit('roundWinner',username);
	}

	async onNextRound(game){
		this.io.in(game._id).emit('nextRound',JSON.stringify(game));
	}
	
	async onGameStartFailed(game_id,reason='Error'){
		this.io.in(game_id).emit('error',reason);
	}
	
	async onCardZarTimeOut(game_id){
		this.io.in(game_id).emit('noZarChoice','Card Zar has timed out before making a choice!');
	}

	async sendAllGames(socket){
		let games = JSON.stringify(this.gameManager.getAllGames());
		socket.emit('games',games);
	}

	async createGame(socket){
		let game_id = this.gameManager.createGame(socket.request.session.username);
		if(game_id){
			socket.request.session.game = game_id;
			socket.emit('createGame',game_id);
		}else{
			socket.emit('createGame',"FAILURE");
		}
	}

	async startGame(socket){
		let game_id = socket.request.session.game;
		if(!game_id){
			socket.emit('error','You are not in a game');
			console.log('User tried to start a game without being in a game');
			return;
		}
		if(!this.gameManager.isGameOwner(game_id,socket.request.session.username)){
			socket.emit('error','Only the game owner can start the game');
			return;
		}
		this.gameManager.startGame(game_id);
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
			game.addPlayer(socket.request.session.username,socket);
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

	async chooseCards(socket,choice){
		let game = this.gameManager.getGame(socket.request.session.game);
		if(game === null){
			socket.emit('error','Game does not exist');
			console.log('Card Zar tried to pick cards in a game that does not exist');
			return;
		}
		if(!game.isCardZar(socket.request.session.username)){
			socket.emit('error','You are not the Card Zar!');
			console.log('A user tried to pick cards when not the card zar!');
			return;
		}

		game.roundWinner(choice);
	}
}


module.exports = GameHandler;