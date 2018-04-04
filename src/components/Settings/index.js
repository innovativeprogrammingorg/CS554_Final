import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardPacks from '../CardPacks';
import * as GAME_SETTINGS from '../../data/settings.js';
import io from 'socket.io-client';
import './settings.css';


class Settings extends Component{

	constructor(){
		super();
		this.state = {
			settings:GAME_SETTINGS,
			setting_values:{
				cardPacks:null
			},
			editable:false
		};
	}

	componentWillMount(){
		this.initSocket();
		this.socket.emit('amIOwner');
	}

	componentWillUnmount(){
		this.socket.close();
	}

	static getDerivedStateFromProps(nextProps,prevState){
		let state = prevState
		if(nextProps.settings){
			state.setting_values = Object.assign(state.setting_values,nextProps.settings);
		}
		state.editable = nextProps.editable;
		
		return state;
	}

	initSocket(){
		this.socket = io('http://localhost:8989');
		
		this.socket.on('updateSetting',(msg)=>{
			this.setState((prevState,props)=>{
				return Object.assign(prevState,msg);
			});
		});
		this.socket.on('owner',()=>{
			this.setState((prevState,props)=>{
				return Object.assign(prevState,{editable:true});
			});
		});
		this.socket.on('amIOwner',(msg)=>{
			if(msg){
				this.setState((prevState,props)=>{
					return Object.assign(prevState,{editable:true});
				});
			}
		});
		this.socket.open();
	}

	settingChanged(setting){
		let value = document.forms.settings[setting].value;
		this.setting_values[setting] = value;
		let out = {};
		out[setting] = value;
		this.socket.emit('updateSetting',out);
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
								   autoComplete="off" disabled={this.state.editable} 
								   onChange={()=>{this.settingChanged(setting.name)}} />  
						</div>
						);
				case "text":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								   maxLength={setting.max} minLength={setting.min} defaultValue={setting.default} 
								   disabled={this.state.editable} onChange={()=>{this.settingChanged(setting.name)}} />  
						</div>
						);
				default:
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name} 
								   defaultValue={setting.default} disabled={this.state.editable} 
								   onChange={()=>{this.settingChanged(setting.name)}} />  
						</div>
					);
			}
	    });
	}

	render(){
		return(
			<form className="settings">
				{this.renderSettings()}
				<CardPacks editable={this.state.editable} cardpacks={this.state.settings.cardPacks}/>
			</form>
		);
	}
}

Settings.propTypes = {
	settings:PropTypes.object
};

export default Settings;