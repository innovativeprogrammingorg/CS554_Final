import React, { Component } from 'react';
import PropTypes from 'prop-types';
import User from '../User/component.js';
import './playersbar.css';

class PlayersBar extends Component{
	renderInternal(){
		return this.props.players.map((player,i)=>{
			return (
				<User key={i} username={player.username} />
			);
		});
	}
	render(){
		return(
			<div className="players_bar">
				{this.renderInternal()}
			</div>
			);
	}
}


PlayersBar.propTypes = {
	players: PropTypes.array  	
};

export default PlayersBar;