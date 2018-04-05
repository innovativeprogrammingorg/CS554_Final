import React, {Component} from 'react';
import Game from '../Game';
import TopPanel from '../TopPanel';
import * as actions from './actions.js';
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
		this.initActions();
	}

	initActions(){
		actions.lobbyFull(()=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.full = true;
				return state;
			});
		});
		actions.lobbyHasRoom(()=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.full = false;
				return state;
			});
		});
		actions.onReceiveGames((games)=>{
			this.setState({
				games:games
			});
		});
		actions.onReceiveGame((game)=>{
			this.setState((prevState, props)=>{
				let games = prevState.games;
				games.push(game);
				return {
					games: games,
					full: prevState.full
				};
			});
		});
		actions.onJoinLobby();	
	}

	createGame(){
		if(this.state.full){
			alert('The Lobby is currently full!');
		}else{
			actions.createGame();
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