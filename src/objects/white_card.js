import Card from 'card.js';


class White_Card extends Card{
	constructor(text){
		super(text);
	}

	clone(){
		return new White_Card(this.text);
	}
}


export default White_Card;