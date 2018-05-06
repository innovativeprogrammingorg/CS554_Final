
export const start_game = (time)=>{
	let min = Math.floor(time/60);
	let sec = time%60;
	return {
		type:'START_GAME',
		min:min,
		sec:sec
	};
};

export const confirm_selection = (cards) =>{
	/**Handle game logic when user confirm card selection**/
	return {
		type: 'SELECTION_CONFIRMED'
	};
};


export const next_round = (round) =>{
	return {
		round: 1+round,
		type:'NEXT_ROUND'
	};
};





