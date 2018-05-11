import React from 'react';
import GameUI from '../GameUI';
import Settings from '../Settings';
import PlayersBar from '../PlayersBar';
import Chat from '../Chat';
import TopPanel from '../TopPanel';
import io from 'socket.io-client';


class Main extends React.Component{
	constructor(){
		super();
		this.state = {
			viewType:'SETTINGS',
			name:'Some Game'
		};
	}

	componentWillMount(){
		this.initSocket();
	}
	
	initSocket(){
		this.socket = io('http://localhost:8989');
		this.socket.on('connect',()=>{
			this.socket.emit('isStarted');
		});
		this.socket.on('start',()=>{
			this.setState((prevState,props)=>({
				viewType:'PLAY'
			}));
		});
		this.socket.on('noGame',()=>{
			window.location = window.location.protocol + "//" + window.location.hostname + ":3000/lobby";
		});
	}

	renderGameArea(){
		switch(this.state.viewType){
			case 'SETTINGS':
				return (<Settings/>);
			case 'PLAY':
				return (<GameUI/>);
			default:
				return;
		}
	}


	startGame(){
		console.log("Called start game");
		this.socket.emit('startGame');
	}

	render(){
		return (
			<div>
				<TopPanel location='game' startGame={this.startGame.bind(this)}/>
				<h1>{this.state.name}</h1>
				{this.renderGameArea()}
				<PlayersBar/>
				<Chat/>
			</div>
			);
	}
}

export default Main;