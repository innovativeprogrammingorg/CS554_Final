import React, { Component } from 'react';
import PropTypes from 'prop-types';
import User from '../User';
import './playersbar.css';

class PlayersBar extends Component{
	constructor(){
		super();
		this.state = {
			players:[]
		};
	}
	componentWillMount(){
		this.initSocket();
	}

	static getDerivedStateFromProps(nextProps,prevState){
		if(!nextProps.players){
			return null;
		}
		return {
			players: nextProps.players;
		}
	}

	initSocket(){
		this.socket = io('http://localhost:8989');
		this.socket.on('joined',(msg)=>{

		});
		this.socket.on('left',(msg)=>{

		});
	}

	renderInternal(){
		return this.state.players.map((player,i)=>{
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