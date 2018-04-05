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
		this.socket = io.connect('localhost:8989');
		this.socket.on('connect',()=>{
			console.log("connected!");
			this.socket.emit('joinLobby','Joined');
		});
		this.socket.on('full',()=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.full = true;
				return state;
			});
		});
		this.socket.on('room',()=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.full = false;
				return state;
			});
		});
		this.socket.on('games',(games)=>{
			this.setState({
				games:games
			});
		});
		this.socket.on('game',(game)=>{
			this.setState((prevState, props)=>{
				let games = prevState.games;
				games.push(game);
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
	}

	createGame(){
		if(this.state.full){
			alert('The Lobby is currently full!');
		}else{
			this.socket.emit('createGame');
		}
		
	}
	renderTopPanel(){
		return (
			<TopPanel location={'lobby'} createGame={this.createGame.bind(this)}/>
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