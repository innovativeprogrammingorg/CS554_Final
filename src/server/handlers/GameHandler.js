const GameManager = require('../../objects/GameManager.js');
const Callbacks = require('./Callbacks.js');
/**
 * +++++++++++++++++++++Events++++++++++++++++++++++
 * 
 * ****Lobby Events****
 * full: the server does not have room for more games
 * room: server has room for more games
 * games: send all games
 * game: new game has been created
 * removeGame: game has been removed
 * createdGame: user created a game successfully
 * joinedGame: redirect the user to the game
 * promptPassword: when the game requires a password
 * incorrectPassword: when the password enter is incorrect
 * 
 * ****Main Game Events****
 * start: game has started
 * winner: someone has won the game
 * gameDraw: no one can win the game
 * 
 * ****Game Events****
 * nextRound: Game is entering the next round
 * gameData: game data has been handshakeed
 * noZarChoice: Card Zar choice timed out
 * played: A player played their cards for the round
 * allPlayed: All played have played their cards for the round
 * iPlayed: The user played their cards for the round
 * displayPlayed: Display all played cards
 *
 * ****Settings Events****
 * updateSetting: game setting update
 * updateCardPacks: game cardpacks update
 * amIOwner: whether or not the player is the current owner of the game
 * owner: The player is now the owner of the game
 *
 * ****Players Events****
 * joined: a new player has joined the game
 * left: when player leaves the game
 *
 * ****Player Events****
 * updateHand: when the player's hand changes
 * zar: when the player becomes the card zar
 *
 * ****Error Events****
 * error: there was an error
 * 
 */
class GameHandler{

	constructor(io){
		this.io = io;
		this.callbacks = new Callbacks(io);
		this.gameManager = new GameManager(this.callbacks.exportCallbacks());
	}

	async sendAllGames(socket){
		socket.emit('games',this.gameManager.getAllGames());
	}

	async createGame(socket){
		let game_id = this.gameManager.createGame(socket.session.username);
		if(game_id){
			socket.session.game = game_id;
			socket.session.save();
			socket.emit('createGame',game_id);
		}else{
			socket.emit('createGame','FAILURE');
		}
	}

	async startGame(socket){
		let game_id = socket.session.game;
		if(!game_id){
			socket.emit('error','You are not in a game');
			console.error('User tried to start a game without being in a game');
			return;
		}
		if(!this.gameManager.isGameOwner(game_id,socket.session.username)){
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
			socket.session.game = game_id;//Auth the player for the game
			socket.session.save();
			socket.emit('joinedGame','Correct Password');
			game.addPlayer(socket.session.username,socket);
			socket.to(game_id).emit('joined',socket.session.username);
		}else if(password === ""){
			socket.emit('promptPassword','This game requires a password');
		}else{
			socket.emit('incorrectPassword','Incorrect Password!');
		}
	}

	async leaveGame(socket){
		let game = this.gameManager.getGame(socket.session.game);
		socket.session.game = null;
		let username = socket.session.username;
		if(game === null){
			console.error("Error, user left a game which does not exist");
			return;
		}

		game.removePlayer(username);
	}

	async updateSettings(socket,new_setting){
		try{
			this.gameManager.updateGame(socket.session.game_id,new_setting);
		}catch(err){
			socket.emit('error',err);
		}
	}

	async updateCardPacks(socket,cardpack){
		try{
			this.gameManager.updateGameCardPacks(socket.session.game_id,cardpack);
		}catch(err){
			socket.emit('error',err);
		}
	}

	async playCards(socket,cards){
		let game_id = socket.session.game;
		let username = socket.session.username;
		if(game_id == null){
			socket.emit('error','You are not in a game!');
			return;
		}
		let game = this.gameManager.getGame(game_id);
		if(game === null){
			console.error('User tried to play in a game which does not exist');
			socket.emit('error','Please rejoin the game. Error: Game not defined');
			return;
		}
		socket.to(game_id).emit('played',game.playCards(username,cards));
		socket.emit('iPlayed',played);
	}

	async chooseCards(socket,choice){
		let game = this.gameManager.getGame(socket.session.game);
		if(game === null){
			socket.emit('error','Game does not exist');
			console.error('Card Zar tried to pick cards in a game that does not exist');
			return;
		}
		if(!game.isCardZar(socket.session.username)){
			socket.emit('error','You are not the Card Zar!');
			console.error('A user tried to pick cards when not the card zar!');
			return;
		}

		game.roundWinner(choice);
	}
	async isOwner(socket){
		try{
			let game = this.gameManager.getGame(socket.session.game);
			socket.emit('amIOwner',(game.players[0].name === socket.session.username));
		}catch(err){
			socket.emit('error',err);
			console.error(err);
		}
	}

	async inGame(socket){
		try{
			let game = this.gameManager.getGame(socket.session.game);
			game.updatePlayer(socket);
			socket.join(socket.session.game);
			socket.emit('gameData',game.getSafeVersion());
		}catch(err){
			socket.emit('error',err);
			console.error(err);
		}
	}
}

module.exports = GameHandler;