import React, {Component} from 'react';
import User from '../User';
import io from 'socket.io-client';
import './playersbar.css';

class PlayersBar extends Component{
	constructor(){
		super();
		this.state = {
			players:[],
			cardZar:-1
		};
	}

	componentDidMount(){
		this.initSocket();
	}

	componentWillUnmount(){
		this.socket.close();
	}

	setZar(zar){
		this.setState((prevState,props)=>{
			let state = prevState;
			state.cardZar = zar;
			return state;
		});
	}

	initSocket(){
		this.socket = io.connect('http://localhost:8989');
		this.socket.on('connect',()=>{
			this.socket.emit('getPlayers');
			this.socket.emit('getZar');
		});
		this.socket.on('players',(players)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.players = players;
				return state;
			});
		});

		this.socket.on('onNewZar',(zar)=>{
			this.setZar(zar);
		});
		this.socket.on('roundWinner',(winner)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				let index = state.players.findIndex((player)=>{
					return player.username === winner;
				});
				if(index !== -1){
					state.players[index].points++;
				}
				return state;
			});
		});

		this.socket.on('joined',(msg)=>{
			console.log('A player has joined the game');
			this.setState((prevState,props)=>{
				let state = prevState;
				let player = {
					username:msg,
					points:0
				};
				state.players.push(player);
				return state;
			});
		});

		this.socket.on('left',(msg)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.players = prevState.players.filter((player)=>{
					return (player.name !== msg);
				});
				return state;
			});
		});

		this.socket.open();
	}

	renderInternal(){
		return this.state.players.map((player,i)=>{
			return (
				<User key={i} username={player.username} points={player.points} zar={i === this.state.cardZar }/>
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

export default PlayersBar;