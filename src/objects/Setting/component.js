import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Setting extends Component{
	render(){
		return this.props.settings.map((setting,i) =>{
			switch(setting.type){
				case "number":
					return (
						<div className="setting">
							<label className={setting.class} for={setting.name}>{setting.display_name}</label>
							<input class={setting.class} type={setting.type} name={setting.name} id={setting.name}
								max={setting.max} min={setting.min} value={setting.default} />  
						</div>
						);
				case "password":
					return (
						<div className="setting">
							<label className={setting.class} for={setting.name}>{setting.display_name}</label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								maxLength={setting.max} minLength={setting.min} value={setting.default} />  
						</div>
						);
				case "text":
					return (
						<div className="setting">
							<label className={setting.class} for={setting.name}>{setting.display_name}</label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								maxLength={setting.max} minLength={setting.min} value={setting.default} />  
						</div>
						);
				default:
					return (
						<div className="setting">
							<label className={setting.class} for={setting.name}>{setting.display_name}</label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name} value={setting.default} />  
						</div>
					);
			}

	       
	    });
	}
}

Setting.propTypes = {
  	settings: PropTypes.array
};

export default Setting;

