const default_state = {
	round:0,
	min:0,
	sec:0
};

export const Game_Reducer = (state = default_state, action)=>{
	switch(action.type){
		case 'START_GAME':
			return {
				...state,
			};
		case 'NEXT_ROUND':
			return {

			};
	}	
};

export default Game_Reducer;