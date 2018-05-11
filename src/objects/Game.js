const DArray = require('./DynamicArray.js');
const uuidv4 = require('uuid/v4');
const {NEXT_ROUND_DELAY} = require('../config/constants.js');
const Settings = require('./Settings.js');
const Player = require('./Player.js');
const Chat = require('./Chat.js');

/**
 * Represents the individual game
 */
const PLAY_CARDS_STAGE = 1;
const CARD_ZAR_CHOICE_STAGE = 2;
const WAIT_FOR_NEXT_ROUND_STAGE = 3;

class Game{
	constructor(callbacks){
		/**
		 * Game vars
		 */
		this._id = uuidv4();
		this.blackDeck = undefined;
		this.whiteDeck = undefined;
		this.settings = new Settings();
		this.players = new DArray();
		this.callbacks = callbacks;
		/**
		 * Game state vars
		 */
		this.state = {
			round:0,
			roundStart:0,
			blackCard:null,
			playedCards:[],
			played: [],
			cardZar:0,
			stage:1
		};
		this.chat = new Chat(this._id,this.callbacks.chat);
	}

	start(){
		console.log("Game.start");
		this.state.round = 1;
		this.drawBlackCard();
		this.dealCards();
		this.state.playedCards = [];
		this.state.played = [];
		this.nextZar();
		this.state.roundStart = Math.floor(Date.now()/1000);
		this.state.stage = PLAY_CARDS_STAGE;
		this.state.timer = this.startTimer();
	}

	nextRound(){
		console.log("Game.nextRound");
		clearTimeout(this.state.timer);
		this.state.round++;
		this.dealCards();
		this.drawBlackCard();
		this.state.playedCards = [];
		this.state.played = [];

		this.nextZar();
		this.state.roundStart = Math.floor(Date.now()/1000);
		this.callbacks.onNextRound(this);
		this.state.stage = PLAY_CARDS_STAGE;
	}

	startTimer(){
		console.log("Game.startTimer stage is "+this.state.stage);
		switch(this.state.stage){
			case PLAY_CARDS_STAGE:
			case CARD_ZAR_CHOICE_STAGE:
				return setTimeout(this.nextStageByTimeOut.bind(this),this.settings.turnDuration * 1000);

			case WAIT_FOR_NEXT_ROUND_STAGE:
				this.callbacks.onRoundEnd(this._id,this.state.winner);
				this.nextRound();
				return null;
				break;
			default:
				console.error('Error, unexpected game stage');
				break;
		}
	}

	nextStageByTimeOut(){
		console.log("Game.nextStageByTimeOut");
		this.state.roundStart = Math.floor(Date.now()/1000);
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
		console.log("Game.nextStage");
		this.state.roundStart = Math.floor(Date.now()/1000);
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
				this.state.stage = PLAY_CARDS_STAGE;
				this.state.timer = this.startTimer();
				break;
			default:
				console.error('Error, unexpected game stage');
				break;	
		}
	}

	

	abort(){
		clearTimeout(this.state.timer);
		this.callbacks.onGameOver(this._id);
		console.log("Game "+this._id+" has been aborted");
	}

	roundWinner(cards_index){
		console.log("Game.roundWinner");

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

	/****Functions for internally modifying the game state*****/

	dealCards(){
		console.log("Game.dealCards");
		for(let i = 0;i<this.players.length();i++){
			let player = this.players.at(i);
			try{
				player.giveCards(this.whiteDeck.draw(player.cardsNeeded()));
				this.callbacks.onHandChanged(player.socket,player.hand);
			}catch(err){
				this.callbacks.onOutOfCards(this._id);
				return;
			}
			
		}
	}

	drawBlackCard(){
		console.log("Game.drawBlackCard");
		try{
			this.state.blackCard = this.blackDeck.draw();
		}catch(err){
			this.callbacks.onOutOfCards(this._id);
			this.callbacks.onGameOver(this._id);
		}
	}

	nextZar(){
		let index = this.state.cardZar + 1;
		if(index >= this.players.length()){
			index = 0;
		}
		if(index === NaN){
			this.abort();
			throw "setZar given NaN as an argument";
		}
		console.log("Game.setZar");
		this.state.cardZar = index;
		console.log("Player at "+index+" is zar");
		try{
			this.callbacks.onNewZar(this.players.at(index).socket, this._id, this.state.cardZar);
		}catch(err){
			console.log(err);
			this.abort();
		}
		
	}

	/****Functions for externally modifying the game state*****/

	playCards(name,cards){
		console.log("Game.playCards");
		if(Math.floor(Date.now()/1000) - this.state.roundStart > this.settings.turnDuration){
			return;
		}
		if(this.state.stage != PLAY_CARDS_STAGE){
			return;
		}

		let player = this.players.lookup("name",name);
		let playedCards = player.getCards(cards);

		//console.log("PlayedCards:");
		//console.log(playedCards);
		//console.log(cards);

		this.state.playedCards.push(playedCards);
		player.removeCards(cards);
		this.state.played.push(name);
		this.dealCards();
		if(this.state.played.length === this.players.length() - 1){
			this.nextStage();//GOTO STAGE 2
		}
		return playedCards;
	}

	updateSettings(newSetting){
		this.settings = Object.assign(this.settings,newSetting);
		this.callbacks.onSettingUpdate(this._id,this.settings);
	}

	updateCardPacks(cardpack){
		this.settings.updateCardPacks(cardpack);
		this.callbacks.onCardPacksUpdate(this._id,cardpack,this.settings.cardPacks);
	}
	
	addPlayer(socket){
		this.players.append(new Player(socket.handshake.session.username,socket));
	}

	updatePlayer(socket){
		console.log("Game.updatePlayer");
		try{
			let player = this.players.lookup("name",socket.handshake.session.username);
			player.socket = socket;
			if(this.state.round !== 0 && player.hand.length() == 0){
				player.giveCards(this.whiteDeck.draw(player.cardsNeeded()));
			}
			this.callbacks.onHandChanged(socket,player.hand);
		}catch(err){
			console.error('Unable to update player\'s socket: '+err);
		}
	}

	removePlayer(name){
		console.log("Game.removePlayer");
		let index = this.players.find("name",name);
		if(index === -1){
			throw new Error("Tried to remove player from game, who is not in the game");
		}
		this.players.remove(index);
		if(this.players.length() < 2){
			this.callbacks.onGameOver(this._id);
			return;
		}
		this.callbacks.onPlayerLeave(this._id,name);
		if(index === 0){
			this.callbacks.onNewOwner(this.players.at(0).socket);
		}
	}

	/*Functions for exporting the game state with only safe/needed data*/

	isCardZar(name){
		return this.state.round >= 1 && this.players.at(this.state.cardZar).name === name;
	}

	hasRoom(){
		return this.settings.maxPlayers > this.players.length(); 
	}

	getPlayersSafe(){
		let players_out = [];
		for(let i = 0;i<this.players.length();i++){
			let player = this.players.at(i);
			players_out.push({
				username:player.name,
				points:player.score
			});
		}
		return players_out;
	}

	getLobbyVersion(){
		let players_out = [];
		for(let i = 0;i<this.players.length();i++){
			players_out.push(this.players.at(i).name);
		}
		return {
			_id:this._id,
			name:this.players.at(0).name + "\'s Game",
			players:players_out,
			noPlayers:this.players.length() + "/" + this.settings.maxPlayers, 
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
			time:this.state.roundStart,
			round:this.state.round,
			stage:this.state.stage,
			cardZar:this.state.cardZar,
			played:this.state.playedCards
		};
	}

	getFullSafeVersion(){
		return{
			blackCard:this.state.blackCard,
			min:Math.floor(this.settings.turnDuration/60),
			sec:this.settings.turnDuration % 60,
			time:this.state.roundStart,
			round:this.state.round,
			stage:this.state.stage,
			cardZar:this.state.cardZar,
			played:this.state.playedCards,
			settings:this.settings
		};
	}
}

module.exports = Game;