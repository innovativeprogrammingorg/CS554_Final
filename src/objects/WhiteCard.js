const Card = require('card.js');


class WhiteCard extends Card{
	constructor(text){
		super(text);
	}

	clone(){
		return new WhiteCard(this.text);
	}
}


module.exports = WhiteCard;