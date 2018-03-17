
export const bc_fetch = ()=>{
	/**Fetch a new black card**/
};

export const bc_fetch_success = (black_card)=>{
	return {
		type: 'BLACK_CARD_FETCH_SUCCESS',
		blank_spaces: black_card.blank_spaces,
		text: blank_card.text
	};
};

export const bc_fetch_pending = ()=>{
	return {
		type: 'BLACK_CARD_FETCH_PENDING'
	};
};

export const bc_fetch_failure = ()=>{
	return {
		type: 'BLACK_CARD_FETCH_FAILURE'
	};
};