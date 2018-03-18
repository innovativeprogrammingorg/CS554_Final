import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Settings extends Component{
	renderSettings(){
		return this.props.settings.map((setting,i) =>{
			let value = setting.default;
			if(this.props.settings_values.hasOwnProperty(setting.name)){
				value = settings_values[setting.name];
			}else{
				settings_values[setting.name] = value;
			}

			switch(setting.type){
				case "number":
					return (
						<div className="setting">
							<label className={setting.class} for={setting.name}> {setting.display_name} </label>
							<input class={setting.class} type={setting.type} name={setting.name} id={setting.name}
								max={setting.max} min={setting.min} value={value} />  
						</div>
						);
				case "password":
					return (
						<div className="setting">
							<label className={setting.class} for={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								maxLength={setting.max} minLength={setting.min} value={value} />  
						</div>
						);
				case "text":
					return (
						<div className="setting">
							<label className={setting.class} for={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								maxLength={setting.max} minLength={setting.min} value={value} />  
						</div>
						);
				default:
					return (
						<div className="setting">
							<label className={setting.class} for={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name} value={value} />  
						</div>
					);
			}

	       
	    });
	}
	render(){
		<div className="settings">
		</div>
	}
}

Settings.propTypes = {
  	settings: PropTypes.array,
  	settings_values:PropTypes.object
};

export default Settings;

