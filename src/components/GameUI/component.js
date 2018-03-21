import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GameActionBar from '../Game_Action_Bar/component.js';
import PlayedCards from '../Played_Cards/component.js';
import PlayerHand from '../Player_Hand/component.js';

class GameUI extends Component{
	
	render(){
		return(
			<div className="game">
				<div className="game_top_bar">
					<span className="game_top_bar" id="Round">{this.props.round}</span>
					<span className="game_top_bar" id="Time">{this.props.min}:{this.props.sec}</span>
				</div>
				<GameActionBar/>
				<PlayedCards/>
				<PlayerHand/>
			</div>
			);
	}
}


GameUI.propTypes = {
	round:PropTypes.number,
	min:PropTypes.number,
	sec:PropTypes.number	
};

export default GameUI;