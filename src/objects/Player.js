const DArray = require('./DynamicArray.js');
const {HAND_SIZE} = require('../config/constants.js');

class Player{

	constructor(name,socket){
		this.name = name;
		this.socket = socket;
		this.score = 0;
		this.hand = new DArray();
		this.missed_turns = 0;
	}
	getCards(args){
		let out = [];
		for(let i = 0;i<args.length;i++){
			out.push[this.hand[args[i]]];
		}
		return out;
	}
	removeCards(args){
		for(let i = 0;i<args.length;i++){
			this.hand.remove(args[i]);
		}
	}
	giveCards(args){
		if((args.length+this.hand.length)>HAND_SIZE){
			throw new Exception("Player given too many cards");
		}
		for(let i = 0;i<args.length;i++){
			this.hand.append(args[i]);
		}
		this.socket.emit('drawCards',JSON.stringify(args));
	}
	awardPoint(){
		this.score++;
	}
	static compareByName(player,prop){
		return player.name == prop;
	}
}

module.exports = Player;