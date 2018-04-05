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
		this.drawBlackCard();
		this.state.playedCards = [];
		this.state.played = [];
		this.setZar(Math.floor(Math.random()*this.players.length));
		this.state.roundStart = Math.floor(Date.now()/1000);
		this.state.stage = PLAY_CARDS_STAGE;
		this.state.timer = this.startTimer();
		this.state.winner = -1;
	}

	startTimer(){
		switch(this.state.stage){
			case PLAY_CARDS_STAGE:
			case CARD_ZAR_CHOICE_STAGE:
				return setTimeout(this.nextStageByTimeOut,this.settings.turnDuration);
			case WAIT_FOR_NEXT_ROUND_STAGE:
				this.callbacks.onRoundEnd(this._id,this.state.winner);
				return setTimeout(this.nextStage,NEXT_ROUND_DELAY);
				break;
			default:
				console.error('Error, unexpected game stage');
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
				console.error('Error, unexpected game stage');
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
				console.error('Error, unexpected game stage');
				break;	
		}
	}

	updateSettings(newSetting){
		this.settings = Object.assign(this.settings,newSetting);
		this.callbacks.onSettingUpdate(this._id,newSetting);
	}

	updateCardPacks(cardpack){
		this.settings.updateCardPacks(cardpack);
		this.callbacks.onCardPacksUpdate(this._id,cardpack);
	}
	
	addPlayer(socket){
		this.players.append(new Player(socket.session.username,socket));
	}

	updatePlayer(socket){
		try{
			let player = this.players.lookup("name",socket.session.username);
			player.socket = socket;
			this.callbacks.onHandChanged(socket,player.hand);
		}catch(err){
			console.error('Unable to update player\'s socket: '+err);
		}
		
	}

	removePlayer(name){
		let index = this.players.find("name",name);
		if(index === -1){
			throw new Error("Tried to remove player from game, who is not in the game");
		}
		this.players.remove(index);
		if(this.players.length === 0){
			this.callbacks.onGameOver(this._id);
			return;
		}
		this.callbacks.onPlayerLeave(this._id,name);
		if(index === 0){
			this.callbacks.onNewOwner(this.players[0].socket);
		}
	}

	isCardZar(name){
		if(this.state.round < 1){
			return false;
		}
		return this.players[this.state.cardZar].name === name;
	}

	setZar(index){
		this.state.cardZar = index;
		this.callbacks.onNewZar(this.players[index].socket);
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
		if(player.score >= this.settings.winPoints){
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
				player.giveCards(this.whiteDeck.draw(player.cardsNeeded()));
				this.callbacks.onHandChanged(player.socket,player.hand);
			}catch(err){
				this.callbacks.onOutOfCards(this._id);
				return;
			}
		}
		this.drawBlackCard();
		this.state.playedCards = [];
		this.state.played = [];
		this.state.winner = -1;
		this.setZar((this.state.cardZar + 1)%this.players.length);
		this.state.stage = PLAY_CARDS_STAGE;
		this.callbacks.onNextRound(this);
	}

	getLobbyVersion(){
		let players_out = [];
		for(let i = 0;i<this.players.length;i++){
			players_out.push(this.players[i].name);
		}
		return {
			name:this.players[0].name + "\'s Game",
			players:players_out,
			noPlayers:this.players.length + "/" + this.settings.maxPlayers, 
			started: (this.state.round === 0),
			cardPacks:this.settings.cardPacks,
			goal:this.settings.winPoints 
		}
	}

	getSafeVersion(){
		return{
			blackCard:this.state.blackCard,
			min:Math.floor(this.settings.turnDuration/60),
			sec:this.settings.turnDuration % 60,
			round:this.state.round,
			stage:this.state.stage
		};
	}

}

module.exports = Game;