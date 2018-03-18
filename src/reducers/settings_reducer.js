const default_state = {
	settings_values = {}
};

export const settings_reducer = (state = default_state, action) =>{
	switch(action.type){
		case 'SETTINGS_CHANGE_VALUE':
			return {
				...state,
				settings_values: action.settings_values
			};
		case 'SETTINGS_INIT_SUCCESS':
			return {
				...state,
				settings: action.settings,
				settings_values: action.settings_values
			};
		case 'SETTINGS_INIT_PENDING':
			return {
				...state
			};
		case 'SETTINGS_INIT_FAILURE':
			return {
				...state
			};
		default:
			return {
				...state
			};
	}
};