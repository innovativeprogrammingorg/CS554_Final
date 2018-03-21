import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Game from '../Game';
import Settings from '../Settings';
import PlayersBar from '../Players_Bar/component.js';
import Chat from '../Chat/component.js';
import TopPanel from '../Top_Panel';
import {GAME_SETTINGS} from '../../data/settings.js';
class Main extends Component{
	renderGame(){
		switch(this.props.viewType){
			case 'SETTINGS':
					return (
						<Settings settings= {GAME_SETTINGS}/>
						);
			case 'PLAY':
				return (<Game/>);
			default:
				return;
		}
	}
	render(){
		return (
			<div>
				<TopPanel/>
				{this.renderGame()}
				<PlayersBar players={[{username:"test_user",points:0},{username:"test_user2",points:0}]}/>
				<Chat user={"test user"} history={[]} />
			</div>
			);
	}
}

Main.propTypes = {
	viewType:PropTypes.string
};

export default Main;