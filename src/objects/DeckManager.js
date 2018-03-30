const WhiteCard =  require('./WhiteCard.js');
const BlackCard = require('./BlackCard.js');
const Deck = require('./Deck.js');
const fs = require('fs');
const card_packs = require('../data/cards/card_packs.js');
const resolve = require('path').resolve;

const CARD_DIRECTORY = './src/data/cards/';
/**
 * Pre-parses the cards to prevent repetitive operations. 
 * Is an expensive object to create so at most one instance should exist per shard
 */
class DeckManager{
	constructor(){
		this.white_ready = false;
		this.black_ready = false;
		this.card_packs = card_packs;
		this.white_cards = {};
		this.black_cards = {};
		/**TODO: Synchronize it better**/
		//console.log(fs.readFileSync(CARD_DIRECTORY+'white_cards.json','utf8'));
		fs.readFile(CARD_DIRECTORY+'white_cards.json','utf8',(err,data)=>{
			let wc_data = JSON.parse(data);
			for(let i = 0;i<this.card_packs.length;i++){
				this.white_cards[this.card_packs[i]] = [];
				try{
					for(let j = 0;j<wc_data[this.card_packs[i]].length;j++){
						this.white_cards[this.card_packs[i]][j] = new WhiteCard(wc_data[this.card_packs[i]][j]);
					}
				}catch(err){
					console.log(this.card_packs[i] + " is undefined in white cards");
					throw new Error("undefined");
				}
				
			}
			this.white_ready = true;

		});
		fs.readFile(CARD_DIRECTORY+'black_cards.json','utf8',(err,data)=>{
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

module.exports = DeckManager;
