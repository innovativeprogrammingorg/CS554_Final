const https = require('https');
const BlackCard = require('BlackCard.js');
const WhiteCard = require('WhiteCard.js');

const BASE_URL = 'https://api.cardcastgame.com/v1/decks/';
const BLACK_CARDS = '/calls';
const WHITE_CARDS = '/responses';

class CardCastAPI{

	static async getNewCards(code){
		let name = await CardCastAPI.getCardsInfo(code);
		let white = await CardCastAPI.getWhiteCards(code);
		let black = await CardCastAPI.getBlackCards(code);
		return {
			name:name,
			whiteCards:white,
			blackCards:black
		};
	}	

	static async getCardsInfo(code){
		return new Promise((resolve,reject)=>{
			https.get(BASE_URL+code,(res)=>{
				if(res.statusCode != 200){
					throw new Error("Deck does not exist");
				}
				let data = '';
				res.on('data',(msg)=>{
					data += msg;
				});

				res.on('end',()=>{
					let info = JSON.parse(data);
					resolve(info.name);
				});
			}).on('error',(e)=>{
				console.error(e);
			});
		});
	}

	static async getWhiteCards(code){
		return new Promise((resolve,reject)=>{
			https.get(BASE_URL+code+WHITE_CARDS,(res)=>{
				if(res.statusCode != 200){
					throw new Error("Deck does not exist");
				}
				let data = '';
				res.on('data',(msg)=>{
					data += msg;
				});

				res.on('end',()=>{
					let cards = JSON.parse(data);
					let cards_out = [];
					for(let i = 0;i<cards.length;i++){
						try{
							cards_out.push(new WhiteCard(cards[i].text[0]));
						}catch(err){
							console.error(err);
						}
					}
					resolve(cards_out);
				});
			}).on('error',(e)=>{
				console.error(e);
			});
		});
	}

	static async getBlackCards(code){
		return new Promise((resolve,reject)=>{
			https.get(BASE_URL+code+BLACK_CARDS,(res)=>{
				if(res.statusCode != 200){
					throw new Error("Deck does not exist");
				}
				let data = '';
				res.on('data',(msg)=>{
					data += msg;
				});

				res.on('end',()=>{
					let cards = JSON.parse(data);
					let cards_out = [];
					for(let i = 0;i<cards.length;i++){
						try{
							let text = cards[i].text.join('_');
							cards_out.push(new BlackCard(text)); 
						}catch(err){
							console.error(err);
						}
					}
					resolve(info.name);
				});
			}).on('error',(e)=>{
				console.error(e);
			});
		});
	}
}

module.exports = CardCastAPI;