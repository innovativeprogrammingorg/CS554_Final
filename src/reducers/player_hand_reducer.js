const default_state = {
	hand: []
};

export const player_hand_reducer = (state = default_state, action){
	switch(action.type){
		case 'DRAW_CARDS_SUCCESS':
			return {

			};
		case 'DRAW_CARDS_PENDING':
			return {

			};
		case 'DRAW_CARDS_FAILURE':
			return {

			};
		case 'REMOVE_CARDS_SUCCESS':
			return {

			};
		case 'REMOVE_CARDS_PENDING':
			return {

			};
		case 'REMOVE_CARDS_FAILURE':
			return {

			};
		default:
			return {

			};
	}
}

export default player_hand_reducer;