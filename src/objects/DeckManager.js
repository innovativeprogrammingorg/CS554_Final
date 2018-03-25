import WhiteCard from 'WhiteCard.js';
import BlackCard from 'BlackCard.js';
import Deck from './Deck.js';
import {} from '../config/directory.js';
import * as fs from 'fs';

const CARD_DIRECTORY = '../data/cards/';
/**
 * Pre-parses the cards to prevent repetitive operations. 
 * Is an expensive object to create so at most one instance should exist per shard
 */
class DeckManager(){
	constructor(){
		this.white_ready = false;
		this.black_ready = false;
		this.card_packs = JSON.parse(fs.readFileSync(CARD_DIRECTORY+'card_packs.json'));
		this.white_cards = {};
		this.black_cards = {};
		/**TODO: Synchronize it better**/
		fs.readFile(CARD_DIRECTORY+'white_cards.json',(err,data)=>{
			let wc_data = JSON.parse(data);
			for(let i = 0;i<this.card_packs.length;i++){
				this.white_cards[this.card_packs[i]] = [];
				for(let j = 0;j<wc_data[this.card_packs[i]].length;j++){
					this.white_cards[this.card_packs[i]][j] = new WhiteCard(wc_data[this.card_packs[i]][j]);
				}
			}
			this.white_ready = true;

		});
		fs.readFile(CARD_DIRECTORY+'black_cards.json',(err,data)=>{
			let bc_data = JSON.parse(data);
			for(let i = 0;i<this.card_packs.length;i++){
				this.black_cards[this.card_packs[i]] = [];
				for(let j = 0;j<bc_data[this.card_packs[i]].length;j++){
					this.black_cards[this.card_packs[i]][j] = new BlackCard(bc_data[this.card_packs[i]][j]);
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

export default DeckManager;
