const DArray = require('DynamicArray.js');
const uuidv4 = require('uuid/v4');
const HAND_SIZE = require('../config/constants.js').HAND_SIZE ;
const Settings = require('./Settings.js');
const Player = require('./Player.js');
/**
 * Represents the individual game
 */
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
			onPlayerLeave:undefined
		};

	}

	start(){
		this.state.round = 1;
		this.draw_blackCard();
		this.state.playedCards = [];
		this.state.played = [];
		this.state.cardZar = Math.floor(Math.random()*this.players.length);
		this.state.roundStart = Math.floor(Date.now()/1000);
	}
	
	addPlayer(name){
		this.players.append(new Player(name));
	}

	removePlayer(name){
		this.players.remove(name,Player.compareByName);
		if(this.players.length === 0){
			this.onGameOver(this._id);
		}else{
			this.onPlayerLeave(this._id,name);
		}
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
		if(Math.floor(Date.now()/1000) - this.state.roundStart > this.settings.turn_duration){
			return;
		}
		let player = this.players.lookup("name",name);
		let played_cards = player.getCards(cards);
		this.state.playedCards.push(played_cards);
		player.removeCards(cards);
		this.state.played.push(name);
		if(this.state.played === this.players.length - 1){
			this.callbacks.onAllUsersPlayed(this._id);
		}
		return played_cards;
	}

	roundWinner(cards_index){
		let name = this.state.played[cards_index];
		let player = this.players.lookup("name",name);
		player.awardPoint();
		if(player.score >= this.settings.win_points){
			this.callbacks.onPlayerWin(this._id,name);
		}
	}

	nextRound(){
		this.state.round++;
		for(let i = 0;i<this.played.length;i++){
			let player = this.players.lookup("name",this.played[i]);
			try{
				player.giveCards(this.whiteDeck.draw(this.blackCard.blank_spaces));
			}catch(err){
				this.callbacks.onOutOfCards(this._id);
				return;
			}
		}
		this.drawBlackCard();
		this.state.playedCards = [];
		this.state.played = [];
		this.state.cardZar = (this.state.cardZar + 1)%this.players.length;
		this.state.roundStart = Math.floor(Date.now()/1000);
	}


}

module.exports = Game;