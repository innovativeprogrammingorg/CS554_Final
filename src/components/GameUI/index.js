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
			selection:-1,//zar
		};
		this.state.time = 100;
	}

	updateTime(){
		this.setState((prevState,props)=>{
			let state = prevState;
			if(state.time > 0){
				state.time--;
			}
			return state;
		});
		if(this.state.time > 0){
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
				let state = prevState;
				state.game = game;
				state.time = state.game.sec + (state.game.min*60);
				state.game.stage = 1;
				return state;
			});
		});

		this.socket.on('gameData',(game)=>{
			/*console.log('Received game data');
			console.log(game);*/
			this.setState((prevState,props)=>{
				let state = prevState;
				state.game = game;
				state.time = (state.game.sec + (state.game.min*60)) - (Math.floor(Date.now()/1000) - game.time);
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
		this.socket.on('roundWinner',(winner)=>{
			console.log(winner+" has won this round!");
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
			return;
		}
		alert('Cannot Select any more cards at once!');
		
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
	outputTime(){
		let sec = this.state.time % 60;
		let min = Math.floor(this.state.time/60);

		let out = "Time: "+min+":";
		if(sec > 9){
			out += sec;
		}else{
			out += "0"+sec;
		}
		return out;
	}
	renderStage(){
		if(this.state.game.stage === 2){
			return (<h1 className="stage">Card Zar is selecting a winner</h1> );
		}
		return (<h1 className="stage">User's are Picking Cards</h1>);
	}
	render(){
		return(
			<div className="gameUI">
				<div className="gameTopBar">
					{this.renderStage()}
					<span className="gameTopBar" id="Round">Round:{this.state.game.round}&emsp;&emsp;</span>
					<span className="gameTopBar" id="Time">
							{this.outputTime()}</span>
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