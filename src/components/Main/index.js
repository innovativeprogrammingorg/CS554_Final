import React, { Component } from 'react';
import GameUI from '../GameUI';
import Settings from '../Settings';
import PlayersBar from '../PlayersBar';
import Chat from '../Chat';
import TopPanel from '../TopPanel';
import {GAME_SETTINGS} from '../../data/settings.js';

class Main extends Component{
	constructor(){
		super();
		this.state = {
			players:[{username:"test_user",points:0},{username:"test_user2",points:0}],
			chatHistory:[],
			username:"test user",
			viewType:'SETTINGS'
		};
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
			<TopPanel startGame={this.startGame.bind(this)}/>
			<h1>{this.props.match.params.id}</h1>
			{this.renderGameArea()}
			<PlayersBar players={this.state.players}/>
			<Chat user={this.username} history={this.state.chatHistory} />
			</div>
			);
	}
	startGame(){
		this.setState((prevState,props)=>({
				viewType:'PLAY'
		}));
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