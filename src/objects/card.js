

class Card{
	constructor(text){
		this.text = text;
	}

	getText(){
		return this.text;
	}

	clone(){
		return new Card(this.text);
	}

}

export default Card