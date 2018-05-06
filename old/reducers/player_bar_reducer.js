const default_state = {
	players: []
};

export const player_bar_reducer = (state = default_state, action)=>{
	switch(action.type){
		case 'GET_PLAYERS_PENDING':
			return {
				...state
			};
		case 'GET_PLAYERS_FAILURE':
			return {
				...state
			};
		case 'GET_PLAYERS_SUCCESS':
			return {
				...state,
				players:action.players
			};
	}
};