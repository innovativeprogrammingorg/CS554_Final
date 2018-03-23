const default_state = {
	blank_spaces:1,
	text:""
};

export const bc_reducer = (state = default_state, action)=>{
	switch(action.type){
		case 'BLACK_CARD_FETCH_SUCCESS':
			return {

			};
		case 'BLACK_CARD_FETCH_PENDING':
			return {

			};
		case 'BLACK_CARD_FETCH_FAILURE':
			return {

			};
		default:
			return {

			};
	}
};

export default bc_reducer;