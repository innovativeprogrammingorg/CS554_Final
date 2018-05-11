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
			full:false,
			toJoin:undefined
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
		this.socket.on('updateCardPacks',(data)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				for(let i = 0;i<state.games.length;i++){
					if(state.games[i]._id === data.id){
						state.games[i].cardPacks = data.cardPacks;
						break;
					}
				}
				return state;
			});
		});
		this.socket.on('updatePlayers',(game)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				for(let i = 0;i < state.games.length;i++){
					if(state.games[i]._id === game._id){
						state.games[i].name = game.name;
						state.games[i].players = game.players;
						state.games[i].noPlayers = game.noPlayers;
						break;
					}

				}
				return state;
			});
		});
		this.socket.on('game',(game)=>{
			console.log(game);
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

		this.socket.on('promptPassword',()=>{
			let password = prompt("Please enter the game's password");
			this.socket.emit('joinGame',{
				game_id:this.state.toJoin,
				password:password
			});
		});

		this.socket.on('incorrectPassword',()=>{
			let password = prompt("The password you entered was incorrect.");
			this.socket.emit('joinGame',{
				game_id:this.state.toJoin,
				password:password
			});
		});

		this.socket.on('joinedGame',()=>{
			window.location = "/game/"+this.state.toJoin;
		});

		this.socket.on('removeGame',(game_id)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.games = state.games.filter((game)=>{
					return game._id !== game_id;
				});
				return state;
			});
		});
	}

	createGame(){
		if(this.state.full){
			alert('The Lobby is currently full!');
		}else{
			this.socket.emit('createGame');
		}
	}

	joinGame(game_id){
		this.socket.emit('joinGame',{
			game_id:game_id,
			password:""
		});
		this.setState((prevState,props)=>{
			let state = prevState;
			state.toJoin = game_id;
			return state;
		});
	}

	renderTopPanel(){
		return (
			<TopPanel location={'lobby'} createGame={this.createGame.bind(this)}/>
		);
	}

	renderGames(){
		return this.state.games.map((game,i)=>{
			return (
				<Game key={i} _id={game._id} gameName={game.name} noPlayers={game.noPlayers}
					  started={game.started} players={game.players} cardPacks={game.cardPacks}
					  goal={game.goal} joinGame={this.joinGame.bind(this)} />
			);
		});
	}
	render(){
		return (
			<div className="lobbyMain">
				{this.renderTopPanel()}
				<div className="games">
					{this.renderGames()}
				</div>
			</div>
		);
	}
}

export default Lobby;