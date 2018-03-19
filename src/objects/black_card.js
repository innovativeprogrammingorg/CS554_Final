import Card from 'card.js';
const blank_space = '______';

class Black_Card extends Card{
	constructor(text){
		let formated_text = text.replace('_',blank_space);
		super(formated_text);
		this.blank_spaces = (formated_text.length - text.length)/(blank_space.length - 1);
		if(this.blank_spaces == 0){
			this.blank_spaces = 1;
		}
	}
	constructor(text,blank_spaces){
		super(text);
		this.blank_spaces = blank_spaces;
	}
	clone(){
		return new Black_Card(this.text,this.blank_spaces);
	}
}

export default Black_Card;