import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './game.css';

class Game extends Component{

	getStatus(){
		return (
				<span className="gameStatus">{this.props.started ? "In Progress" : "Not Started" }</span>
			);
	}
	createGameHeader(){
		return(
			<h1 className='game'><span className="gameName">{this.props.gameName}</span>{this.getStatus()}</h1>
			);
	}
	render(){
		return(
			<div className="game">
				<div className="gameInfo">
					{this.createGameHeader()}
					<p className="gameInfo"><span>Players:</span>({this.props.noPlayers}){this.props.players.join(", ")}</p>
					<p className="gameInfo"><span>Pts to Win:</span>{this.props.goal}</p>
					<p className="gameInfo"><span>Card Packs:</span>{this.props.cardPacks.data.join(", ")}</p>
				</div>
				<button className="game" onClick={()=>{this.props.joinGame(this.props._id)}}>Join</button>
			</div>
		);
	}
}

Game.defaultProps = {
	gameName:"Test Game",
	noPlayers:0,
	started:false,
	players:[],
	cardPacks:"None",
	goal:10
};

Game.propTypes = {
	_id:PropTypes.string,
	gameName:PropTypes.string,
	noPlayers:PropTypes.string,
	started:PropTypes.bool,
	players:PropTypes.array,
	cardPacks:PropTypes.object,
	goal:PropTypes.number,
	joinGame:PropTypes.func
};

export default Game;