import React, { Component } from 'react';
import PropTypes from 'prop-types';
import User from '../User/component.js'

class Players_Bar extends Component{
	renderInternal(){
		return this.props.players.map((player,i)=>{
			return (
				<User username={player.username} isOwner={ i==0 ? true : false} />
			);
		});
	}
	render(){
		return(
			<div className="players_bar">
				{renderInternal()}
			</div>
			);
	}
}


Players_Bar.propTypes = {
	players: PropTypes.array  	
};

export default Players_Bar;