

export const draw_cards = (cards = [])=>{
	/**Draws cards for the user's hand**/
};

export const remove_cards = (cards = [])=>{
	/**Removes cards from the users hand**/
}

export const edit_blank_card = (text,loc,cards)=>{
	/**Handles the custom blank card (Maybe handle client side)**/
}

export const draw_cards_success = (hand)=>{
	return{
		hand_cards: hand,
		type: 'DRAW_CARDS_SUCCESS'
	};
}

export const draw_cards_failure = () =>{
	return{
		type: 'DRAW_CARDS_FAILURE';
	};
};

export const draw_cards_pending = ()=>{
	return{
		type: 'DRAW_CARDS_PENDING'
	};
};

export remove_cards_success = (cards)=>{
	return{
		hand_cards:cards,
		type: 'REMOVE_CARDS_SUCCESS'
	};
};

export remove_cards_pending = ()=>{
	return{
		type:'REMOVE_CARDS_PENDING'
	};
}

export remove_cards_failure = () =>{
	return{
		type:'REMOVE_CARDS_FAILURE'
	};
}


