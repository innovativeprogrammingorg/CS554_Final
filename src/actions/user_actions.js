

export const receive_point = (points)=>{
	/**Handle the player receiving a point for the game**/
};

export const become_zar = ()=>{
	return {
		type:"USER_BECOME_ZAR",
		card_zar:true
	};
}; 

export const remove_zar = ()=>{
	return {
		type:'USER_NOT_ZAR',
		card_zar:false
	};
};