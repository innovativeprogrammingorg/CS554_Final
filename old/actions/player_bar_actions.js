

export const pb_get_players = (game_id)=>{
	
	return dispatch =>{
		/**Handle getting the current users in the game**/
		dispatch(pb_get_players_pending());
	};
};

export const pb_get_players_pending = ()=>{
	return {
		type:'GET_PLAYERS_PENDING'
	};
};

export const pb_get_players_failure = (error)=>{
	return {
		type:'GET_PLAYERS_FAILURE'
	};
};

export const pb_get_players_success = (players) =>{
	return {
		type:'GET_PLAYERS_SUCCESS',
		players:players

	}
};