import White_Card from 'white_card.js';
import Black_Card from 'black_card.js';
import Deck from 'deck.js';

const fs = require('fs');
const card_dir = '../data/cards/';
/**
 * Pre-parses the cards to prevent repetitive operations. 
 * Is an expensive object to create so at most one instance should exist
 */
class Deck_Manager(){
	constructor(){
		this.white_ready = false;
		this.black_ready = false;
		this.card_packs = JSON.parse(fs.readFileSync(card_dir+'card_packs.json'));
		this.white_cards = {};
		this.black_cards = {};
		/**TODO: Synchronize it better**/
		fs.readFile(card_dir+'white_cards.json',(err,data)=>{
			let wc_data = JSON.parse(data);
			for(let i = 0;i<this.card_packs.length;i++){
				this.white_cards[this.card_packs[i]] = [];
				for(let j = 0;j<wc_data[this.card_packs[i]].length;j++){
					this.white_cards[this.card_packs[i]][j] = new White_Card(wc_data[this.card_packs[i]][j]);
				}
			}
			this.white_ready = true;

		});
		fs.readFile(card_dir+'black_cards.json',(err,data)=>{
			let bc_data = JSON.parse(data);
			for(let i = 0;i<this.card_packs.length;i++){
				this.black_cards[this.card_packs[i]] = [];
				for(let j = 0;j<bc_data[this.card_packs[i]].length;j++){
					this.black_cards[this.card_packs[i]][j] = new Black_Card(bc_data[this.card_packs[i]][j]);
				}
			}
			this.black_ready = true;
		});
	}

	ready(){
		return this.white_ready && this.black_ready;
	}

	getWCDeck(packs){
		let deck = new Deck();
		for(let i = 0; i < packs.length;i++){
			/**Warning: Potential break point**/
			for(let j = 0;j<this.white_cards[packs[i]].length;j++){
				deck.add(this.white_cards[packs[i]][j].clone());
			}
		}
		deck.shuffle();
		return deck;
	}

	getBCDeck(packs){
		let deck = new Deck();
		for(let i = 0; i < packs.length;i++){
			/**Warning: Potential break point**/
			for(let j = 0;j<this.black_cards[packs[i]].length;j++){
				deck.add(this.black_cards[packs[i]][j].clone());
			}
		}
		deck.shuffle();
		return deck;
	}
}

export default Deck_Manager;
