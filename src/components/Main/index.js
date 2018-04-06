import React, { Component } from 'react';
import GameUI from '../GameUI';
import Settings from '../Settings';
import PlayersBar from '../PlayersBar';
import Chat from '../Chat';
import TopPanel from '../TopPanel';
import io from 'socket.io-client';


class Main extends Component{
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
		
		this.socket.on('loggedOut',(msg)=>{
			alert(msg);
			window.location = '/'; 
		});

		this.socket.on('start',()=>{
			this.setState((prevState,props)=>({
				viewType:'PLAY'
			}));
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