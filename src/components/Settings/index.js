import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardPacks from '../CardPacks';
import './settings.css';

class Settings extends Component{
	renderSettings(){
		return this.props.settings.map((setting,i) =>{
			let value = setting.default;
			switch(setting.type){
				case "number":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								max={setting.max} min={setting.min} defaultValue={value} />  
						</div>
						);
				case "password":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								maxLength={setting.max} minLength={setting.min} defaultValue={value} autoComplete="off" />  
						</div>
						);
				case "text":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								maxLength={setting.max} minLength={setting.min} defaultValue={value} />  
						</div>
						);
				default:
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name} defaultValue={value} />  
						</div>
					);
			}

	       
	    });
	}
	render(){
		return(
				<form className="settings">
					{this.renderSettings()}
					<CardPacks/>
				</form>
			);

	}
}

Settings.propTypes = {
  	settings: PropTypes.array
};

export default Settings;

