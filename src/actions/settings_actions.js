const fs = require('fs');

export const settings_change_value = (settings_values,key,value)=>{
	settings_values[key] = value;
	return {
		type: 'SETTINGS_CHANGE_VALUE',
		settings_values: settings_values
	};
};

export const init_settings = ()=>{
	return dispatch => {
		dispatch(init_settings_pending());
		fs.readFile('../data/settings.json',(err,data)=>{
			if(err){
				dispatch(init_settings_failure());
			}else{
				let settings = JSON.parse(data);
				dispatch(init_settings_success(settings));
			}
		});
	};
	
	
};

export const init_settings_success = (settings)=>{
	return {
		type: 'SETTINGS_INIT_SUCCESS',
		settings:settings,
		settings_values:{}
	};
};

export const init_settings_failure = ()=>{
	return {
		type: 'SETTINGS_INIT_FAILURE'
	};
};

export const init_settings_pending = ()=>{
	return {
		type: 'SETTINGS_INIT_PENDING'
	};	
};