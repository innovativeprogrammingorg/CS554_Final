const GAME_SETTINGS = require('../data/settings.js');
const DArray = require('./DynamicArray.js');

class Settings{
	constructor(){
		for(let i = 0;i<GAME_SETTINGS.length;i++){
			this[GAME_SETTINGS[i].name] = GAME_SETTINGS[i].default;
		}
		this.cardPacks = new DArray();
	}
	
	updateCardPacks(cardpack){
		let index = this.cardPacks.find2(cardpack);
		if(index === -1){
			this.cardPacks.append(cardpack);
		}else{
			this.cardPacks.remove(index);
		}
	}
}

module.exports = Settings;