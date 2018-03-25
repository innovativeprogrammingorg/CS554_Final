import Card from 'card.js';


class WhiteCard extends Card{
	constructor(text){
		super(text);
	}

	clone(){
		return new WhiteCard(this.text);
	}
}


export default WhiteCard;