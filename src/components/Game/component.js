import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Game_Action_Bar from '../Game_Action_Bar/component.js';
import Played_Cards from '../Played_Cards/component.js';
import Player_Hand from '../Player_Hand/component.js';

class Game extends Component{
	
	render(){
		return(
			<div className="game">
				<div className="game_top_bar">
					<span className="game_top_bar" id="Round">{this.props.round}</span>
					<span className="game_top_bar" id="Time">{this.props.min}:{this.props.sec}</span>
				</div>
				<Game_Action_Bar/>
				<Played_Cards/>
				<Player_Hand/>
			</div>
			);
	}
}


Game.propTypes = {
	round:PropTypes.number,
	min:PropTypes.number,
	sec:PropTypes.number	
};

export default Game;