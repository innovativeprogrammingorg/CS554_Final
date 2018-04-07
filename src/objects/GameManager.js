const DeckManager = require('./DeckManager.js');
const DArray = require('./DynamicArray.js');
const Game = require('./Game.js');
const {GAME_CAPACITY} = require('../config/constants.js');

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
	/**
	 * Updates the settings of a game
	 * @param  {uuid}   game_id [description]
	 * @param  {object} update  ex. {setting_name:new_value}
	 * @return {boolean} whether or not the game was updated successfully
	 */
	updateGame(game_id,update){
		let game = this.getGame(game_id);
		if(game.state.round != 0){
			return false;
		}
		game.updateSettings(update);
	}

	updateGameCardPacks(game_id,cardpack){
		let game = this.getGame(game_id);

		if(game.state.round != 0){
			return false;
		}
		game.updateCardPacks(cardpack);
	}

	createGame(owner){
		if(this.games.length >= GAME_CAPACITY || this.full){
			return false;
		}
		if(this.games.length == GAME_CAPACITY - 1){
			this.callbacks.onMaxCapacity();
			this.full = true;
		}
		let game = new Game();
		game.addPlayer(owner);
		game.callbacks = this.callbacks.game;
		this.callbacks.onGameCreate(game.getLobbyVersion());
		this.games.append(game);
		return game._id;
	}
	/**
	 * starts a game
	 * @return {Boolean}           Whether or not a game was created successfully
	 */
	startGame(game_id){
		let game = this.getGame(game_id);
		if(game.players.length < 2){
			this.callbacks.onGameStartFailed(game._id,'Not enough players');
			return false;
		}
		if(game.state.round !== 0){
			this.callbacks.onGameStartFailed(game._id,'Game has already started!');
			return false;
		}
		if(game.settings.cardPacks.length < 1){
			this.callbacks.onGameStartFailed(game._id,'No card packs have been chosen');
			return false;
		}
		try{
			game.whiteDeck = this.deckManager.getWCDeck(game.settings.cardPacks);
			game.blackDeck = this.deckManager.getBCDeck(game.settings.cardPacks);
			game.start();
			this.games.append(game);
			this.callbacks.onGameStart(game._id);
			return true;
		}catch(err){
			console.error(err);
			return false;
		}
		
	}

	removeGame(game_id){
		this.games.removeByProperty("_id",game_id);
		if(this.full){
			this.callbacks.onSpaceAvailible();
			this.full = false;
		}
		this.callbacks.onGameRemoved(game_id);
	}

	getGame(game_id){
		return this.games.lookup("_id",game_id);
	}

	isGameOwner(game_id,username){
		try{
			return username === this.getGame(game_id).players.at(0).name;
		}catch(err){
			console.log(err);
			return false;
		}
		
	}
	/**
	 * Converts all games into a safe form to be sent
	 */
	getAllGames(){	
		let games = [];
		for(let i = 0;i<this.games.length();i++){
			games.push(this.games.at(i).getLobbyVersion());
		}
		return games;
	}
}

module.exports = GameManager;