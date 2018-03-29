const DeckManager = require('./DeckManager.js');
const DArray = require('./DynamicArray.js');
const Game = require('./Game.js');
const GAME_CAPACITY = require('../config/constants.js').GAME_CAPACITY;

/**
 * Handles game creation and capacity
 * Only one instance of this class should exist per shard
 */
class GameManager{
	/**
	 * Constructs a new GameManager
	 * @param  callbacks
			onMaxCapacity:called when max capacity is reached,
			onSpaceAvailible:called when all spaces are no longer filled,
			onGameStart:called when a game is started
			game: callbacks which will be passed to the game objects
				onAllUsersPlayed:called when all users have played their cards
					@param game_id The id of the game calling the function
				onPlayerWin:called when a player has won the game
					@param game_id The id of the game calling the function
					@param name    The name of the player who won the game
				onOutOfCards: called when a game has run out of cards before a player has won
					@param game_id The id of the game calling the function
			
		
	 */
	constructor(callbacks){
		this.full = false;
		this.callbacks = callbacks;
		this.callbacks.game.onGameOver = this.removeGame;
		this.deckManager = new DeckManager();
		this.games = new DArray();
	}
	updateGame(game_id){
		let game = this.getGame(game_id);
	}

	createGame(owner){
		let game = new Game();
		game.addPlayer(owner);
	}
	/**
	 * starts a game
	 * @return {Boolean}           Whether or not a game was created successfully
	 */
	startGame(game_id){
		if(this.games.length >= GAME_CAPACITY || this.full){
			return false;
		}
		if(this.games.length == GAME_CAPACITY - 1){
			this.callbacks.onMaxCapacity();
			this.full = true;
		}
		try{
			
			game.start();
			this.games.append(game);
			this.callbacks.onGameStart(game._id);
			return true;
		}catch(err){
			return false;
		}
		
	}

	removeGame(game_id){
		this.games.removeByProperty("_id",game_id);
		if(this.full){
			this.callbacks.onSpaceAvailible();
			this.full = false;
		}
	}

	getGame(game_id){
		return this.games.lookup("_id",game_id);
	}


}

module.exports = GameManager;