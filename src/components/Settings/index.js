import React from 'react';
import PropTypes from 'prop-types';
import CardPacks from '../CardPacks';
import * as GAME_SETTINGS from '../../data/settings.js';
import io from 'socket.io-client';
import './settings.css';


class Settings extends React.Component{

	constructor(){
		super();
		this.state = {
			settings:GAME_SETTINGS,
			settingValues:{
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
			state.settingValues = Object.assign(state.settingValues,nextProps.settings);
		}
		state.editable = nextProps.editable;
		
		return state;
	}

	initSocket(){
		this.socket = io('http://localhost:8989');

		this.socket.on('connect',()=>{
			console.log('getting settings');
			this.socket.emit('getSettings');
		});
		
		this.socket.on('updateSetting',(msg)=>{
			this.setState((prevState,props)=>{
				console.log(msg);
				let state = prevState;
				state.settingValues = Object.assign(state.settingValues,msg);
				console.log(state);
				return state;
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
		this.setState((prevState,props)=>{
			let state = prevState;
			state.settingValues[setting] = value;
		});
		let out = {};
		out[setting] = value;
		this.socket.emit('updateSetting',out);
	}
	getValue(name,defaultV){
		if(this.state.settingValues[name]){
			return this.state.settingValues[name];
		}
		return defaultV;
	}

	renderSettings(){
		return this.state.settings.map((setting,i) =>{
			console.log(this.state.settingValues[setting.name]);
			switch(setting.type){
				case "number":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								   max={setting.max} min={setting.min} value={this.getValue(setting.name,setting.default)} 
								   disabled={!this.state.editable} onChange={()=>{this.settingChanged.bind(this)(setting.name)}}/>  
						</div>
						);
				case "password":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								   maxLength={setting.max} minLength={setting.min} value={this.getValue(setting.name,setting.default)} 
								   autoComplete="off" disabled={!this.state.editable} 
								   onChange={()=>{this.settingChanged(setting.name)}} />  
						</div>
						);
				case "text":
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name}
								   maxLength={setting.max} minLength={setting.min} value={this.getValue(setting.name,setting.default)}  
								   disabled={!this.state.editable} onChange={()=>{this.settingChanged(setting.name)}} />  
						</div>
						);
				default:
					return (
						<div key={i} className="setting">
							<label className={setting.class} htmlFor={setting.name}> {setting.display_name} </label>
							<input className={setting.class} type={setting.type} name={setting.name} id={setting.name} 
								   value={this.getValue(setting.name,setting.default)} disabled={!this.state.editable} 
								   onChange={()=>{this.settingChanged(setting.name)}} />  
						</div>
					);
			}
	    });
	}

	getCardPacks(){
		if(this.state.settingValues.cardPacks){
			return this.state.settingValues.cardPacks.data;
		}
		return [];
	}

	render(){
		return(
			<form className="settings" name="settings">
				{this.renderSettings()}
				<CardPacks editable={this.state.editable} cardpacks={this.getCardPacks()}/>
			</form>
		);
	}
}

Settings.propTypes = {
	settings:PropTypes.object
};

export default Settings;