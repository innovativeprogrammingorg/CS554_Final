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
		this.selected = [];//Player
		this.selection = -1;//Zar
		this.state = {
			game:{
				round:0,
				min:0,
				sec:0,
				played:[],
				stage:0,
				roundWinner:-1,
				blackCard:null
			},
			player:{
				cards:[],
				isZar:false,
				played:false,
				ownCards:-1
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
			this.setState((prevState,props)=>{
				return Object.assign(prevState,{game:game});
			});
		});

		this.socket.on('gameData',(game)=>{
			this.setState((prevState,props)=>{
				return Object.assign(prevState,{game:game});
			});
		});

		this.socket.on('played',(cards)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.game.played.push(cards);
				return state;
			});
		});
		this.socket.on('allPlayed',()=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.game.stage = 2;
				return state;
			});
		});
		this.socket.on('iPlayed',(cards)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.player.ownCards = state.game.played.push(cards) - 1;
				return state;
			});
		});
		this.socket.on('zar',()=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.player.isZar = true;
				return state;
			});
		});
		this.socket.on('updateHand',(cards)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.player.cards = cards;
				return state;
			});
		});
		this.socket.on('noZarChoice',()=>{
			alert('Card Zar took too long to choose a winner');
		});

		this.socket.on('displayPlayed',(winner)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.game.stage = 3;
				state.game.roundWinner = winner;
				return state;
			});
		});

		this.socket.open();
	}

	onSelectCard(index){
		if(this.state.player.isZar){
			return;
		}

		if(this.selected.length === 0){
			this.selected.push(index);
			return;
		}

		if(this.selected.includes(index)){
			this.selected = this.selected.filter((val,i,arr)=>{
				return val !== index;
			});
			return;
		}
		if(this.selected.length < this.state.game.blackCard.blankSpaces){
			this.selected.push(index);
		}else{
			alert('Cannot Select any more cards at once!');
		}
	}

	onSelectCardGroup(index){
		if(!this.state.player.isZar){
			return;
		}
		if(index === this.selection){
			this.selection = -1;
		}else{
			this.selection = index;
		}
	}

	onConfirm(){
		if(this.state.player.isZar){
			if(this.selection === -1){
				alert('Select a card first!');
				return;
			}
			this.socket.emit('chooseCards',this.selection);
			this.setState((prevState,props)=>{
				let state = prevState;
				state.player.isZar = false;
				return state;
			});
		}else{
			if(this.selected.length !== this.state.blackCard.blankSpaces){
				alert('Select more cards!');
				return;
			}
			this.socket.emit('playCards',this.selected);
		}
	}
	renderPlayedCards(){
		switch(this.state.game.stage){
			case 1:
				return (
					<PlayedCards cards={this.state.game.played} usersCards= {this.state.player.ownCards} 
								 onSelect={this.onSelectCardGroup.bind(this)}}/>
				);
			case 2:
				if(this.state.player.isZar){
					return (
						<PlayedCards cards={this.state.game.played} usersCards= {this.state.player.ownCards}
									 onSelect={this.onSelectCardGroup.bind(this)}}/>
					);
				}
				return (
					<PlayedCards cards={this.state.game.played} selectable={true} displayAll={true}
									 onSelect={this.onSelectCardGroup.bind(this)}}/>
				);
			case 3:
				return (
					<PlayedCards cards={this.state.game.played} displayAll={true}
									 onSelect={this.onSelectCardGroup.bind(this)}}/>
				);
			default:
				return;
		}
	}
	render(){
		return(
			<div className="game">
				<div className="game_top_bar">
					<span className="game_top_bar" id="Round">{this.state.round}</span>
					<span className="game_top_bar" id="Time">{this.state.min}:{this.state.sec}</span>
				</div>
				<GameActionBar blackCard={this.state.blackCard.text} onConfirmSelection={this.onConfirm.bind(this)} />
				{this.renderPlayedCards()}
				<PlayerHand cards={this.state.player.cards} onSelect={this.onSelectCard.bind(this)} selectable={!this.state.player.isZar}/>
			</div>
		);
	}
}

export default GameUI;