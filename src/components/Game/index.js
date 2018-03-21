import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Game extends Component{
	getStatus(){
		return (
				<span className="game_status">{this.props.started ? "In Progress" : "Not Started" }</span>
			);
	}
	createGameHeader(){
		return(
			<h1 className='game'><span className="game_name">{this.props.gameName}</span>{this.getStatus}</h1>
			);
		
	}
	render(){
		return(
			<div className="game">
				<div className="game_info">
					{this.createGameHeader()}
					<p className="game_info"><span>Players:</span></p>
					<p className="game_info"><span>Spectators:</span></p>
					<p className="game_info"><span>Pts to Win:</span></p>
					<p className="game_info"><span>Card Packs:</span></p>
				</div>
			</div>
			);
	}
}

Game.defaultProps = {
	gameName:"Test Game",
	no_players:0,
	started:false,
	players:"None",
	card_packs:"None",
	goal:10,
	spectators:""
};

Game.propTypes = {
	gameName:PropTypes.string,
	no_players:PropTypes.number,
	started:PropTypes.boolean,
	players:PropTypes.string,
	card_packs:PropTypes.string,
	goal:PropTypes.number,
	spectators:PropTypes.string
};

export default Game;