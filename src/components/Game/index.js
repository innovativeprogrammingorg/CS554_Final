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
			<h1 className='game'><span className="game_name">{this.props.gameName}</span>{this.getStatus()}</h1>
			);
		
	}
	render(){
		return(
			<div className="game">
				<div className="game_info">
					{this.createGameHeader()}
					<p className="game_info"><span>Players:</span>({this.props.noPlayers}){this.props.players}</p>
					<p className="game_info"><span>Pts to Win:</span>{this.props.goal}</p>
					<p className="game_info"><span>Card Packs:</span>{this.props.cardPacks}</p>
				</div>
			</div>
			);
	}
}

Game.defaultProps = {
	gameName:"Test Game",
	noPlayers:0,
	started:false,
	players:"None",
	cardPacks:"None",
	goal:10
};

Game.propTypes = {
	gameName:PropTypes.string,
	noPlayers:PropTypes.string,
	started:PropTypes.boolean,
	players:PropTypes.string,
	cardPacks:PropTypes.string,
	goal:PropTypes.number
};

export default Game;