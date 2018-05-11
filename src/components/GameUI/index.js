import React, { Component } from 'react';
import GameActionBar from '../GameActionBar';
import PlayedCards from '../PlayedCards';
import PlayerHand from '../PlayerHand';
import io from 'socket.io-client';
import './GameUI.css';

class GameUI extends Component{
	constructor(){
		super();
		this.state = {
			game:{
				round:-1,
				min:-1,
				sec:-1,
				played:[],
				stage:0,
				roundWinner:-1,
				blackCard:{
					blankSpaces:1,
					text:"Black Card"
				}
			},
			player:{
				cards:[],
				isZar:false,
				played:false,
				ownCards:-1
			},
			selected:[],//player
			selection:-1//zar
		};
	}

	updateTime(){
		this.setState((prevState,props)=>{
			let state = prevState;
			if(state.game.sec <= 0){
				if(state.game.min > 0){
					state.game.sec = 59;
					state.game.min--;
				}
			}else{
				state.game.sec--;
			}
			return state;
		});
		if(this.state.game.min > 0 || this.state.game.sec > 0){
			setTimeout(this.updateTime.bind(this),1000);
		}
	}

	componentDidMount(){
		this.initSocket();
		setTimeout(this.updateTime.bind(this),1000);
	}

	componentWillUnmount(){
		this.socket.close();
	}

	initSocket(){
		this.socket = io('http://localhost:8989');
		this.socket.on('connect',()=>{
			this.socket.emit('inGame');
			this.socket.emit('amIZar');
		});

		this.socket.on('nextRound',(game)=>{
			this.setState((prevState,props)=>{
				return Object.assign(prevState,{game:game});
			});
		});

		this.socket.on('gameData',(game)=>{
			/*console.log('Received game data');
			console.log(game);*/
			this.setState((prevState,props)=>{
				let state = prevState;
				state.game = game;
				return state;
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
				state.player.ownCards = state.game.played.push(cards);
				return state;
			});
		});
		this.socket.on('zar',()=>{
			console.log('zar');
			this.setState((prevState,props)=>{

				let state = prevState;
				state.player.isZar = true;
				return state;
			});
		});
		this.socket.on('noZar',()=>{
			console.log('noZar');
			this.setState((prevState,props)=>{
				let state = prevState;
				state.player.isZar = false;
				return state;
			});
		})
		this.socket.on('updateHand',(cards)=>{
			this.setState((prevState,props)=>{
				console.log("updateHand has been called");
				//console.log(cards);
				let state = prevState;
				state.player.cards = cards.data;
				return state;
			});
		});
		this.socket.on('noZarChoice',()=>{
			console.log('Card Zar took too long to choose a winner');
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

		if(this.state.selected.length === 0){
			this.setState((prevState,props)=>{
				let state = prevState;
				state.selected.push(index);
				return state;
			});
			return;
		}

		if(this.state.selected.includes(index)){
			this.setState((prevState,props)=>{
				let state = prevState;
				state.selected = state.selected.filter((val,i,arr)=>{
					return val !== index;
				});
				return state;
			});
			return;
		}
		if(this.state.selected.length < this.state.game.blackCard.blankSpaces){
			this.setState((prevState,props)=>{
				let state = prevState;
				state.selected.push(index);
				return state;
			});
		}else{
			alert('Cannot Select any more cards at once!');
		}
	}

	onSelectCardGroup(index){
		if(!this.state.player.isZar){
			return;
		}
		if(index === this.state.selection){
			this.setState((prevState,props)=>{
				let state = prevState;
				state.selection = -1;
				return state;
			});
		}else{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.selection = index;
				return state;
			});
		}
	}

	onConfirm(){
		if(this.state.player.isZar){
			if(this.selection === -1){
				alert('Select a card first!');
				return;
			}
			this.socket.emit('chooseCards',this.state.selection);
			this.setState((prevState,props)=>{
				let state = prevState;
				state.player.isZar = false;
				return state;
			});
		}else{
			if(this.state.selected.length !== this.state.game.blackCard.blankSpaces){
				alert('Select more cards!');
				return;
			}
			this.socket.emit('playCards',this.state.selected);
		}
	}
	renderPlayedCards(){
		switch(this.state.game.stage){
			case 1:
				return (
					<PlayedCards cards={this.state.game.played} usersCards= {this.state.player.ownCards} 
								 onSelect={this.onSelectCardGroup.bind(this)}/>
				);
			case 2:
				if(!this.state.player.isZar){
					return (
						<PlayedCards cards={this.state.game.played} usersCards= {this.state.player.ownCards}
									 onSelect={this.onSelectCardGroup.bind(this)} selectable={false} displayAll={true}/>
					);
				}
				return (
					<PlayedCards cards={this.state.game.played} selectable={true} displayAll={true}
									 onSelect={this.onSelectCardGroup.bind(this)}/>
				);
			case 3:
				return (
					<PlayedCards cards={this.state.game.played} displayAll={true}
									 onSelect={this.onSelectCardGroup.bind(this)}/>
				);
			default:
				return;
		}
	}
	render(){
		return(
			<div className="gameUI">
				<div className="gameTopBar">
					<span className="gameTopBar" id="Round">Round:{this.state.game.round}&emsp;&emsp;</span>
					<span className="gameTopBar" id="Time">
							Time:&nbsp;{this.state.game.min}:{this.state.game.sec > 9 ? this.state.game.sec : "0" + this.state.game.sec }</span>
				</div>
				<div className="gameBoard">
					<GameActionBar blackCard={this.state.game.blackCard.text} onConfirmSelection={this.onConfirm.bind(this)} />
					{this.renderPlayedCards()}
				</div>
				<PlayerHand cards={this.state.player.cards ? this.state.player.cards : []} onSelect={this.onSelectCard.bind(this)} selectable={!this.state.player.isZar}/>
			</div>
		);
	}
}

export default GameUI;