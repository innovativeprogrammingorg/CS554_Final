function Deck_Mapper(index){
	this.index = index;
	this.rand = Math.random();
}

const d_sorter = (a,b)=>{
	return a.rand - b.rand;
}

class Deck{
	constructor(cards = []){
		this.cards = cards;
		this.shuffle();
	}

	add(card){
		this.cards.push(card);
	}

	shuffle(){
		let deck = [];
		let mapper = [];
		for(let i = 0;i<this.cards.length;i++){
			mapper.push(new Deck_Mapper(i));
		}
		mapper.sort(d_sorter);
		for(let i = 0;i<this.cards.length;i++){
			deck.push(cards[mapper[i].index]);
		}
		this.cards = deck;
	}

	draw(no_cards = 1){
		if(no_cards > this.cards.length){
			throw new Exception("Not enough cards left in deck");
		}
		if(no_cards == 1){
			return this.cards.pop();
		}
		let out = [];
		for(let i = 0;i<no_cards;i++){
			out.push(this.cards.pop());
		}
		return out;
	}


}



module.exports = Deck;