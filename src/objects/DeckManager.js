const WhiteCard =  require('./WhiteCard.js');
const BlackCard = require('./BlackCard.js');
const Deck = require('./Deck.js');
const fs = require('fs');
const cardPacks = require('../data/cards/card_packs.js');
const resolve = require('path').resolve;

const CARD_DIRECTORY = './src/data/cards/';
/**
 * Pre-parses the cards to prevent repetitive operations. 
 * Is an expensive object to create so at most one instance should exist per shard
 */
class DeckManager{
	constructor(){
		this.whiteReady = false;
		this.blackReady = false;
		this.cardPacks = cardPacks;
		this.whiteCards = {};
		this.blackCards = {};
		/**TODO: Synchronize it better**/
		//console.log(fs.readFileSync(CARD_DIRECTORY+'whiteCards.json','utf8'));
		fs.readFile(CARD_DIRECTORY+'white_cards.json','utf8',(err,data)=>{
			let wcData = JSON.parse(data);
			for(let i = 0;i<this.cardPacks.length;i++){
				this.whiteCards[this.cardPacks[i]] = [];
				try{
					for(let j = 0;j<wcData[this.cardPacks[i]].length;j++){
						this.whiteCards[this.cardPacks[i]][j] = new WhiteCard(wcData[this.cardPacks[i]][j]);
					}
				}catch(err){
					console.log(this.cardPacks[i] + " is undefined in white cards");
					throw new Error("undefined");
				}
				/*console.log("White Cards are ready:");
				console.log(this.whiteCards);*/
			}
			this.whiteReady = true;

		});
		fs.readFile(CARD_DIRECTORY+'black_cards.json','utf8',(err,data)=>{
			let bcData = JSON.parse(data);
			for(let i = 0;i<this.cardPacks.length;i++){
				this.blackCards[this.cardPacks[i]] = [];
				for(let j = 0;j<bcData[this.cardPacks[i]].length;j++){
					this.blackCards[this.cardPacks[i]][j] = new BlackCard(bcData[this.cardPacks[i]][j]);
				}
			}
			/*console.log("Black Cards are ready:");
			console.log(this.blackCards);*/
			this.blackReady = true;
		});
	}

	ready(){
		return this.whiteReady && this.blackReady;
	}

	getWCDeck(packs){
		let deck = new Deck();
		for(let i = 0; i < packs.length;i++){
			/**Warning: Potential break point**/
			for(let j = 0;j<this.whiteCards[packs[i]].length;j++){
				deck.add(this.whiteCards[packs[i]][j].clone());
			}
		}
		deck.shuffle();
		return deck;
	}

	getBCDeck(packs){
		let deck = new Deck();
		for(let i = 0; i < packs.length;i++){
			/**Warning: Potential break point**/
			for(let j = 0;j<this.blackCards[packs[i]].length;j++){
				deck.add(this.blackCards[packs[i]][j].clone());
			}
		}
		deck.shuffle();
		return deck;
	}
}

module.exports = DeckManager;
