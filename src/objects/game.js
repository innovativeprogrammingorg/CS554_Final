
import DArray from 'dynamic_array.js';
import * as uuidv4 from 'uuid/v4';
import {HAND_SIZE} from '../config/constants.js';
/**
 * Represents the individual game
 */
class Game{
	constructor(black_deck,white_deck,settings,players...){
		/**
		 * Game vars
		 */
		this._id = uuidv4();
		this.black_deck = black_deck;
		this.white_deck = white_deck;
		this.settings = settings;
		this.players = new DArray();
		for(let i = 0;i < players.length;i++){
			this.players.append(players[i]);
		}
		/**
		 * Game state vars
		 */
		this.state = {
			round:0,
			round_start:0,
			black_card:null,
			played_cards:{},
			played: [],
			card_zar:-1
		};
		/**
		 * Defines the callbacks for in game events
		 */
		this.callbacks = {
			on_all_users_played:undefined,

		};

	}

	start(){
		this.state.round = 1;
		this.draw_black_card();
		this.state.played_cards = {};
		this.state.played = [];
		this.state.card_zar = Math.floor(Math.random()*this.players.length);
		this.state.round_start = Math.floor(Date.now()/1000);
	}

	addPlayer(player){
		this.players.append(player);
	}

	removePlayer(name){
		this.players.remove(name,Player.compareByName);
	}

	deal_cards(){
		for(let i = 0;i<this.players.length;i++){
			this.players[i].give_cards(this.white_deck.draw(HAND_SIZE));
		}
	}

	draw_black_card(){
		this.state.black_card = this.black_deck.draw();
	}

	play_cards(name,cards){
		let player = this.players.lookup("name",name);
		this.state.played_cards[name] = player.get_cards(cards);
		this.state.played.push(name);
		if(this.state.played === this.players.length - 1){
			this.callbacks.on_all_users_played(this._id);
		}
	}

	round_winner()






}

export default Game;