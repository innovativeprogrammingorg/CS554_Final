
class WhiteCard{
	constructor(text){
		this.text = text;
	}

	clone(){
		return new WhiteCard(this.text);
	}
}


module.exports = WhiteCard;