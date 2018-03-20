import Deck from 'deck.js';
import Player from 'player.js';
import DArray from 'dynamic_array.js';

class Game{
	constructor(black_deck,white_deck,players...){
		this.black_deck = black_deck;
		this.white_deck = white_deck;
		this.players = new DArray();
		for(let i = 0;i < players.length;i++){
			this.players.append(players[i]);
		}
	}

	addPlayer(player){
		this.players.append(player);
	}

	removePlayer(name){
		this.players.remove(name,Player.compareByName);
	}

	deal_cards()
}