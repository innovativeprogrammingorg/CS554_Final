const {BLANK_SPACE} =  require('../config/constants.js');

class BlackCard{
	constructor(text,blankSpaces = -1){
		if(blankSpaces === -1){
			this.blankSpaces = 0;
			let formatedText = text;
			if(!formatedText.includes("<$blank_space/>")){
				this.blankSpaces = 1;
			}else{
				while(formatedText.includes("<$blank_space/>")){
					formatedText = formatedText.replace("<$blank_space/>",BLANK_SPACE);
					this.blankSpaces++;
				}
			}
			this.text = formatedText;
		}else{
			this.blankSpaces = blankSpaces;
			this.text = text;
		}
	}
	clone(){
		return new BlackCard(this.text,this.blankSpaces);
	}
}

module.exports = BlackCard;