import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GameUI from '../GameUI/';
import Settings from '../Settings';
import PlayersBar from '../Players_Bar/component.js';
import Chat from '../Chat/component.js';
import TopPanel from '../Top_Panel';
import {GAME_SETTINGS} from '../../data/settings.js';

class Main extends Component{
	renderGameArea(){
		switch(this.props.viewType){
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
			{this.renderGameArea()}
			<PlayersBar players={[{username:"test_user",points:0},{username:"test_user2",points:0}]}/>
			<Chat user={"test user"} history={[]} />
			</div>
			);
	}
	render(){
		return (
			<div>
				{this.renderGame()}
			</div>
			);
	}
}

Main.propTypes = {
	viewType:PropTypes.string
};

export default Main;