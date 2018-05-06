const {BLANK_SPACE} =  require('../config/constants.js');

class BlackCard{
	constructor(text,blankSpaces = -1){
		if(blankSpaces === -1){
			let formatedText = text.replace('_',BLANK_SPACE);
			this.text = formatedText;
			this.blankSpaces = (formatedText.length - text.length)/(BLANK_SPACE.length - 1);
		}else{
			this.blankSpaces = blankSpaces;
			this.text = text;
		}
		
		if(this.blankSpaces == 0){
			this.blankSpaces = 1;
		}
	}
	clone(){
		return new BlackCard(this.text,this.blankSpaces,true);
	}
}

module.exports = BlackCard;