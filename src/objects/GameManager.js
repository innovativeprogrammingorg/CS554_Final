import DeckManager from './DeckManager.js';
import DArray from './DynamicArray.js';
import Game from './Game.js';
import {GAME_CAPACITY} from '../config/constants.js';

/**
 * Handles game creation and capacity
 * Only one instance of this class should exist per shard
 */
class GameManager{

	constructor(){
		this.full = false;
		this.callbacks = {
			onMaxCapacity:undefined,
			onSpaceAvailible:undefined,
			onGameStart:undefined
		};
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
		if(this.games.length >= GAME_CAPACITY){
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
		}
	}

	getGame(game_id){
		return this.games.lookup("_id",game_id);
	}





}