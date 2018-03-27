import React, { Component } from 'react';
import PropTypes from 'prop-types';
import User from '../User';
import './playersbar.css';

class PlayersBar extends Component{
	renderInternal(){
		return this.props.players.map((player,i)=>{
			return (
				<User key={i} username={player.username} points={player.points} />
			);
		});
	}
	render(){
		return(
			<div className="players_bar">
				<h2 className="player_bar_title">Players</h2>
				{this.renderInternal()}
			</div>
			);
	}
}


PlayersBar.propTypes = {
	players: PropTypes.array  	
};

export default PlayersBar;