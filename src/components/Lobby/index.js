import React, {Component} from 'react';
import Game from '../Game';
import TopPanel from '../TopPanel';
import io from 'socket.io-client';
import './lobby.css';

class Lobby extends Component{
	constructor(){
		super();
		this.state = {
			games:[],
			full:false
		};
	}

	componentWillMount(){
		this.initSocket();
	}

	initSocket(){
		this.socket = io('http://localhost:8989');

		this.socket.on('connect',()=>{
			this.socket.emit('joinLobby','Joined');
		});

		this.socket.on('full',(msg)=>{
			this.setState({
				full:true
			});
		});

		this.socket.on('room',(msg)=>{
			this.setState({
				full:false
			});
		});

		this.socket.on('games',(msg)=>{
			let games = JSON.parse(msg);
			this.setState({
				games:games
			});
		});

		this.socket.on('error',(msg)=>{
			alert(msg);
		});

		this.socket.on('game',(msg)=>{
			this.setState((prevState, props)=>{
				let games = prevState.games;
				games.push(JSON.parse(msg));
				return {
					games: games,
					full: prevState.full
				};
			});
		});

		this.socket.on('createGame',(msg)=>{
			if(msg==='FAILURE'){
				alert('Error: Could not create a game');
			}else{
				window.location = window.location.protocol + "//" + window.location.hostname + ":3000/game/"+msg;
			}
		});
		this.socket.open();
	}

	lobbyFull(){
		alert('The Lobby is currently full!');
	}

	createGame(){
		this.socket.emit('createGame','Creating a game...');
	}
	renderTopPanel(){
		return (
			<TopPanel location={'lobby'} createGame={(this.state.full ? this.lobbyFull : this.createGame).bind(this)}/>
		);
	}

	renderGames(){
		return this.state.games.map((game,i)=>{
			return (
				<Game gameName={game.name} noPlayers={game.noPlayers}
					  started={game.started} players={game.players}
					  cardPacks={game.cardPacks} goal={game.goal}/>
			);
		});
	}
	render(){
		return (
			<div className="lobby_main">
				{this.renderTopPanel()}
				<div className="games">
					{this.renderGames()}
				</div>
			</div>
		);
	}
}

export default Lobby;