import {GAME_SETTINGS} from '../data/settings.js';


class Settings{
	constructor(){
		for(let i = 0;i<GAME_SETTINGS.length;i++){
			this[GAME_SETTINGS[i].name] = GAME_SETTINGS[i].default;
		}
	}

	[Symbol.iterator](){
		return Object.keys(this).map(key=>this[key]).values();
	}

}