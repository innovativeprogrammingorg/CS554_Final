import DeckManager from './DeckManager.js';
import DArray from './DynamicArray.js';
import Game from './Game.js';
import {GAME_CAPACITY} from '../config/constants.js';

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
			onGameStart:called when a game is started,
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
	 * Creates a new game, and then starts that game
	 * @param  {Array} card_packs  The cardpacks chosen for the game
	 * @param  {Object} settings   The game settings
	 * @param  {Array} players     The current players in the game
	 * @return {Boolean}           Whether or not a game was created successfully
	 */
	createGame(card_packs,settings,players){
		if(this.games.length >= GAME_CAPACITY || this.full){
			return false;
		}
		if(this.games.length == GAME_CAPACITY - 1){
			this.callbacks.onMaxCapacity(this._id);
			this.full = true;
		}
		try{
			let game = new Game(
				this.deckManager.getBCDeck(cardpacks),
				this.deckManager.getWCDeck(cardpacks),
				settings,
				players);
			game.start();
			this.games.append(game);
			this.callbacks.onGameStart(game);
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