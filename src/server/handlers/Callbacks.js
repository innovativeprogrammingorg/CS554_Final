
class Callbacks{
	
	constructor(io){
		this.io = io;
	}

	exportCallbacks(){
		return {
			onMaxCapacity:this.onServerFull.bind(this),
			onSpaceAvailible:this.onServerHasRoom.bind(this),
			onGameStart:this.onGameStart.bind(this),
			onGameCreate:this.onGameCreate.bind(this),
			onGameRemoved: this.onGameRemoved.bind(this),
			onGameStartFailed:this.onGameStartFailed.bind(this),
			game:{
				onAllUsersPlayed:this.onAllUsersPlayed.bind(this),
				onPlayerWin:this.onPlayerWin.bind(this),
				onOutOfCards:this.onGameOutOfCards.bind(this),
				onPlayerLeave:this.onPlayerLeave.bind(this),
				onRoundWon:this.onRoundWon.bind(this),
				onNextRound:this.onNextRound.bind(this),
				onCardZarTimeOut:this.onCardZarTimeOut.bind(this),
				onSettingUpdate:this.onSettingUpdate.bind(this),
				onCardPacksUpdate:this.onCardPacksUpdate.bind(this),
				onNewOwner:this.onNewOwner.bind(this),
				onNewZar:this.onNewZar.bind(this),
				onHandChanged:this.onHandChanged.bind(this),
				onRoundEnd:this.onRoundEnd.bind(this)
			}
		};

	}

	async onServerFull(){
		this.io.in('lobby').emit('full','Lobby is full!');
		console.log("onServerFull");
	}

	async onServerHasRoom(){
		this.io.in('lobby').emit('room','Room for more games!');
		console.log("onServerHasRoom");
	}

	async onGameCreate(game){
		this.io.in('lobby').emit('game',game);
		console.log("onGameCreate");
	}	

	async onGameRemoved(game_id){
		this.io.in('lobby').emit('removeGame',game_id);
		console.log("onGameRemoved");
	}

	async onGameStart(game_id){
		console.log("Starting game "+game_id);
		this.io.in(game_id).emit('start');
		console.log("onGameStart");
	}

	async onAllUsersPlayed(game_id){
		this.io.in(game_id).emit('allPlayed');
		console.log("onAllUsersPlayed");
	}

	async onPlayerLeave(game_id,username){
		this.io.in(game_id).emit('left',username);
		console.log("onPlayerLeave");
	}

	async onPlayerWin(game_id,winner){
		this.io.in(game_id).emit('winner',username);
		console.log("onPlayerWin");
	}

	async onGameOutOfCards(game_id){
		this.io.in(game_id).emit('gameDraw','No more cards left, game is a draw!');
		console.log("onGameOutOfCards");
	}

	async onRoundWon(game_id,username){
		this.io.in(game_id).emit('roundWinner',username);
		console.log("onRoundWon");
	}

	async onNextRound(game){
		this.io.in(game._id).emit('nextRound',game.getSafeVersion());
		console.log("onNextRound");
	}
	
	async onGameStartFailed(game_id,reason='Error'){
		console.error("Game couldn't start because "+reason);
		this.io.in(game_id).emit('error',reason);
		console.log("onGameStartFailed");
	}

	async onCardZarTimeOut(game_id){
		this.io.in(game_id).emit('noZarChoice','Card Zar has timed out before making a choice!');
		console.log("onCardZarTimeOut");
	}

	async onSettingUpdate(game_id,settings){
		this.io.in(game_id).emit('updateSetting',settings);
		console.log("onSettingUpdate");
	}

	async onCardPacksUpdate(game_id,cardpack,cardPacks){
		this.io.in(game_id).emit('updateCardPacks',cardpack);

		this.io.in('lobby').emit('updateCardPacks',{
			id:game_id,
			cardPacks:cardPacks
		});
		console.log("onCardPacksUpdate");
	}

	async onNewOwner(socket){
		socket.emit('owner');
		console.log("onNewOwner");
	}

	async onNewZar(socket){
		socket.emit('zar');
		console.log("onNewZar");
	}

	async onHandChanged(socket,cards){
		socket.emit('updateHand',cards);
		console.log("onHandChanged");
	}

	async onRoundEnd(game_id,winner){
		this.io.in(game_id).emit('displayPlayed',winner);
		console.log("onRoundEnd");
	}
}

module.exports = Callbacks;