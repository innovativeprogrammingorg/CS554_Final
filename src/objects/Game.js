const DArray = require('./DynamicArray.js');
const uuidv4 = require('uuid/v4');
const {HAND_SIZE, NEXT_ROUND_DELAY} = require('../config/constants.js');
const Settings = require('./Settings.js');
const Player = require('./Player.js');

/**
 * Represents the individual game
 */
const PLAY_CARDS_STAGE = 1;
const CARD_ZAR_CHOICE_STAGE = 2;
const WAIT_FOR_NEXT_ROUND_STAGE = 3;

class Game{
	constructor(blackDeck=null,whiteDeck=null,settings=null,players=[]){
		/**
		 * Game vars
		 */
		this._id = uuidv4();
		this.blackDeck = blackDeck;
		this.whiteDeck = whiteDeck;
		this.settings = (settings===null)? new Settings() : settings;
		this.players = new DArray();
		this.winner = undefined;

		for(let i = 0;i < players.length;i++){
			this.players.append(players[i]);
		}
		/**
		 * Game state vars
		 */
		this.state = {
			round:0,
			roundStart:0,
			blackCard:null,
			playedCards:{},
			played: [],
			cardZar:-1
		};
		/**
		 * Defines the callbacks for in game events
		 */
		this.callbacks = {
			onAllUsersPlayed:undefined,
			onPlayerWin:undefined,
			onOutOfCards:undefined,
			onGameOver:undefined,
			onPlayerLeave:undefined,
			onCardZarTimeOut:undefined
		};

	}

	start(){
		this.state.round = 1;
		this.draw_blackCard();
		this.state.playedCards = [];
		this.state.played = [];
		this.state.cardZar = Math.floor(Math.random()*this.players.length);
		this.state.roundStart = Math.floor(Date.now()/1000);
		this.state.stage = PLAY_CARDS_STAGE;
		this.state.timer = this.startTimer();
	}
	startTimer(){
		switch(this.state.stage){
			case PLAY_CARDS_STAGE:
			case CARD_ZAR_CHOICE_STAGE:
				return setTimeout(this.nextStageByTimeOut,this.settings.turnDuration);
			case WAIT_FOR_NEXT_ROUND_STAGE:
				return setTimeout(this.nextStage,NEXT_ROUND_DELAY);
				break;
			default:
				break;
		}
		
	}

	nextStageByTimeOut(){
		switch(this.state.stage){
			case PLAY_CARDS_STAGE:
				this.callbacks.onAllUsersPlayed(this._id);
				this.state.stage = CARD_ZAR_CHOICE_STAGE;
				this.state.timer = this.startTimer();
				break;
			case CARD_ZAR_CHOICE_STAGE:
				this.callbacks.onCardZarTimeOut(this._id);
				this.state.stage = WAIT_FOR_NEXT_ROUND_STAGE;
				this.state.timer = this.startTimer();
				break;
			
			default:
				console.log('Error, unexpected game stage');
				break;
		}
	}

	nextStage(){
		switch(this.state.stage){
			case PLAY_CARDS_STAGE:
				clearTimeout(this.state.timer);
				this.callbacks.onAllUsersPlayed(this._id);
				this.state.stage = CARD_ZAR_CHOICE_STAGE;
				this.state.timer = this.startTimer();
				break;
			case CARD_ZAR_CHOICE_STAGE:
				clearTimeout(this.state.timer);
				this.state.stage = WAIT_FOR_NEXT_ROUND_STAGE;
				this.state.timer = this.startTimer();
			case WAIT_FOR_NEXT_ROUND_STAGE:
				this.nextRound();
				this.state.timer = this.startTimer();
				break;
			default:
				console.log('Error, unexpected game stage');
				break;	
		}
	}

	updateSettings(newSetting){
		this.settings.update(newSetting);
	}
	
	addPlayer(socket){
		this.players.append(new Player(socket.request.session.username,socket.id));
	}
	updatePlayer(socket){
		try{
			this.players.lookup("name",socket.request.session.username).socket = socket;
		}catch(err){
			console.log('Unable to update player\'s socket: '+err);
		}
		
	}
	removePlayer(name){
		this.players.remove(name,Player.compareByName);
		if(this.players.length === 0){
			this.onGameOver(this._id);
		}else{
			this.onPlayerLeave(this._id,name);
		}
	}

	isCardZar(name){
		if(this.state.round < 1){
			return false;
		}
		return this.players[this.state.cardZar].name === name;
	}

	hasRoom(){
		return this.settings.maxPlayers < this.players.length; 
	}
	

	dealCards(){
		for(let i = 0;i<this.players.length;i++){
			this.players[i].give_cards(this.whiteDeck.draw(HAND_SIZE));
		}
	}

	drawBlackCard(){
		try{
			this.state.blackCard = this.blackDeck.draw();
		}catch(err){
			this.callbacks.onOutOfCards(this._id);
			this.callbacks.onGameOver(this._id);
		}
		
	}

	playCards(name,cards){
		if(Math.floor(Date.now()/1000) - this.state.roundStart > this.settings.turnDuration){
			return;
		}
		if(this.state.stage != PLAY_CARDS_STAGE){
			return;
		}

		let player = this.players.lookup("name",name);
		let playedCards = player.getCards(cards);
		this.state.playedCards.push(playedCards);
		player.removeCards(cards);
		this.state.played.push(name);
		if(this.state.played === this.players.length - 1){
			this.nextStage();
		}
		return playedCards;
	}

	roundWinner(cards_index){
		clearTimeout(this.state.timer);
		let name = this.state.played[cards_index];
		let player = this.players.lookup("name",name);
		player.awardPoint();
		if(player.score >= this.settings.win_points){
			this.callbacks.onPlayerWin(this._id,name);
		}else{
			this.callbacks.onRoundWon(this._id,name);
			this.nextStage();
		}
	}

	nextRound(){
		this.state.round++;
		for(let i = 0;i<this.played.length;i++){
			let player = this.players.lookup("name",this.played[i]);
			try{
				player.giveCards(this.whiteDeck.draw(this.blackCard.blankSpaces));
			}catch(err){
				this.callbacks.onOutOfCards(this._id);
				return;
			}
		}
		this.drawBlackCard();
		this.state.playedCards = [];
		this.state.played = [];
		this.state.cardZar = (this.state.cardZar + 1)%this.players.length;
		this.state.stage = PLAY_CARDS_STAGE;
		this.callbacks.onNextRound(this);
	}


}

module.exports = Game;