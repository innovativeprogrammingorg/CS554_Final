const default_state = {
	text:"",
	selected:false
};

export const wc_reducer = (state = default_state, action)=>{
	switch(action.type){
		case 'WHITE_CARD_SELECTED':
			return {

			};
		case 'WHITE_CARD_DESELECTED':
			return {

			};
		default:
			return {

			};
	}
};

export default wc_reducer;
