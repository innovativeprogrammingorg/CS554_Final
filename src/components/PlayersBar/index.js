import React, {Component} from 'react';
import PropTypes from 'prop-types';
import User from '../User';
import io from 'socket.io-client';
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

	componentWillUnmount(){
		this.socket.close();
	}

	static getDerivedStateFromProps(nextProps,prevState){
		if(!nextProps.players ){
			return null;
		}
		return {
			players: nextProps.players
		};
	}

	initSocket(){
		this.socket = io.connect('http://localhost:8989');
		this.socket.on('connect',()=>{
			this.socket.emit('getPlayers');
		});
		this.socket.on('players',(players)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.players = players;
				return state;
			});
		});

		this.socket.on('joined',(msg)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				let player = {
					name:msg,
					points:0
				};
				state.players.push(player);
				return state;
			});
		});

		this.socket.on('left',(msg)=>{
			this.setState((prevState,props)=>{
				return prevState.filter((player,index,arr)=>{
					return (player.name !== msg);
				});
			});
		});

		this.socket.open();
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