import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardPacks from '../CardPacks';
import {GAME_SETTINGS} from '../../data/settings.js';
import './settings.css';


class Settings extends Component{
	constructor(){
		super();
		this.state = {
			settings:GAME_SETTINGS,
			setting_values:{},
			editable:false
		};
	}

	componentWillMount(){
		this.initSocket();
	}

	initSocket(){
		this.socket = io('http://localhost:8989');
	}

	settingChanged(setting){
		let value = document.
		this.setting_values[setting]
	}

	renderSettings(){
		return this.state.settings.map((setting,i) =>{
			switch(setting.type){
				case "number":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								   max={setting.max} min={setting.min} defaultValue={setting.default} 
								   disabled={this.state.editable} onChange={()=>{this.settingChanged(setting.name)}}/>  
						</div>
						);
				case "password":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								   maxLength={setting.max} minLength={setting.min} defaultValue={setting.default} 
								   autoComplete="off" disabled={this.state.editable} />  
						</div>
						);
				case "text":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								   maxLength={setting.max} minLength={setting.min} defaultValue={setting.default} 
								   disabled={this.state.editable } />  
						</div>
						);
				default:
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name} 
								   defaultValue={setting.default} disabled={this.state.editable}  />  
						</div>
					);
			}
	    });
	}

	render(){
		return(
			<form className="settings">
				{this.renderSettings()}
				<CardPacks editable={this.state.editable}/>
			</form>
		);
	}
}

export default Settings;