import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GameActionBar from '../GameActionBar';
import PlayedCards from '../PlayedCards';
import PlayerHand from '../PlayerHand';
import io from 'socket.io-client';
import 'GameUI.css';

class GameUI extends Component{
	constructor(){
		super();
		this.state = {
			game:{
				round:0,
				min:0,
				sec:0,
				played:[],
				stage:0
			},
			player:{
				cards:[],
				isZar:false,
				played:false,
				selected:[]
			}

		};
	}

	componentWillMount(){
		this.initSocket();
		this.socket.emit('inGame');
	}

	componentWillUnmount(){
		this.socket.close();
	}

	static getDerivedStateFromProps(nextProps,prevState){
		return nextProps;
	}

	initSocket(){
		this.socket = io('http://localhost:8989');

		this.socket.on('nextRound',(game)=>{

		});
		this.socket.on('gameData',(game)=>{

		});
		this.socket.on('played',(cards)=>{

		});
		this.socket.on('allPlayed',()=>{

		});
		this.socket.on('iPlayed',(cards)=>{

		});
		this.socket.on('zar',()=>{
			this.setState((prevState,props)=>{

			});
		});
		this.socket.on('updateHand',(cards)=>{

		});
		this.socket.on('noZarChoice',()=>{

		});

		this.socket.open();
	}

	onSelectCard(index){

	}

	onSelectCardGroup(index){

	}

	onConfirm(){

	}

	render(){
		return(
			<div className="game">
				<div className="game_top_bar">
					<span className="game_top_bar" id="Round">{this.state.round}</span>
					<span className="game_top_bar" id="Time">{this.state.min}:{this.state.sec}</span>
				</div>
				<GameActionBar/>
				<PlayedCards/>
				<PlayerHand/>
			</div>
		);
	}
}


GameUI.propTypes = {
	round:PropTypes.number,
	min:PropTypes.number,
	sec:PropTypes.number	
};

export default GameUI;