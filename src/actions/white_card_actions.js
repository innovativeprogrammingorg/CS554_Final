
export const wc_selected = (order)=>{
	return {
		type:'WHITE_CARD_SELECTED',
		selected:true,
		order: order
	};
};

export const wc_deselected = ()=>{
	return {
		type:'WHITE_CARD_DESELECTED',
		selected:false
	};
};