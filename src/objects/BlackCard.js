import Card from 'Card.js';
import {BLANK_SPACE} from '../config/constants.js';

class BlackCard extends Card{
	constructor(text){
		let formated_text = text.replace('_',BLANK_SPACE);
		super(formated_text);
		this.blank_spaces = (formated_text.length - text.length)/(BLANK_SPACE.length - 1);
		if(this.blank_spaces == 0){
			this.blank_spaces = 1;
		}
	}
	constructor(text,blank_spaces){
		super(text);
		this.blank_spaces = blank_spaces;
	}
	clone(){
		return new BlackCard(this.text,this.blank_spaces);
	}
}

export default BlackCard;