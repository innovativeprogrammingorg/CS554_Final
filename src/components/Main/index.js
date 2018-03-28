import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GameUI from '../GameUI';
import Settings from '../Settings';
import PlayersBar from '../PlayersBar';
import Chat from '../Chat';
import TopPanel from '../TopPanel';
import {GAME_SETTINGS} from '../../data/settings.js';
const defaultState = {
	players:[{username:"test_user",points:0},{username:"test_user2",points:0}],
	chatHistory:[],
	username:"test user",
	viewType:'SETTINGS'
};
class Main extends Component{
	constructor(){
		super();
		this.state = defaultState;
	}
	renderGameArea(){
		switch(this.state.viewType){
			case 'SETTINGS':
					return (
						<Settings settings= {GAME_SETTINGS}/>
						);
			case 'PLAY':
				return (<GameUI/>);
			default:
				return;
		}
	}
	renderGame(){
		return (
			<div>
			<TopPanel/>
			<h1>{this.props.match.params.id}</h1>
			{this.renderGameArea()}
			<PlayersBar players={this.state.players}/>
			<Chat user={this.username} history={this.state.chatHistory} />
			</div>
			);
	}
	startGame(){

	}
	render(){
		return (
			<div>
				{this.renderGame()}
			</div>
			);
	}
}

export default Main;