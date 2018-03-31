import React, {Component} from 'react';
import Game from '../Game';
import TopPanel from '../TopPanel';
import './lobby.css';
import io from 'socket.io-client';


class Lobby extends Component{
	constructor(){
		super();
		this.state = {
			games:[],
			full:false
		};
		this.socket = io('http://localhost:8989');
		this.socket.on('connect',()=>{
			this.socket.emit('joinLobby','Joined');
		});
		this.socket.on('full',(msg)=>{
			this.setState({
				full:true
			})
		});
	}

	lobbyFull(){
		alert('The Lobby is currently full!');
	}

	createGame(){
	}

	renderTopPanel(){
		return (
			<TopPanel location={'lobby'} createGame={this.state.full ? (this.lobbyFull : this.createGame).bind(this)}/>
			);
	}

	renderGames(){
		return this.state.games.map((game,i)=>{
			return (
				<Game gameName={game.name} no_players={game.no_players}
					  started={game.started} players={game.players}
					  card_packs={game.card_packs} goal={game.goal}/>
			);
		});
	}
	render(){
		return (
			<div class="lobby_main">
				{this.renderTopPanel()}
				<div class="games">
					{this.renderGames()}
				</div>
			</div>
		);
		
	}
}





export default Lobby;