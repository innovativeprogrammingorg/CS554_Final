const GAME_SETTINGS = require('../data/settings.js');


class Settings{
	constructor(){
		for(let i = 0;i<GAME_SETTINGS.length;i++){
			this[GAME_SETTINGS[i].name] = GAME_SETTINGS[i].default;
		}
		this['cardPacks'] = [];
	}

	[Symbol.iterator](){
		return Object.keys(this).map(key=>this[key]).values();
	}

	update(new_settings){
		Object.assign(this,new_settings);
	}

}

module.exports = Settings;