
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
				onRoundEnd:this.onRoundEnd.bind(this),
				chat:{
					onNewMessage:this.onNewMessage.bind(this)
				}
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

	async onGameRemoved(gameId){
		this.io.in('lobby').emit('removeGame',gameId);
		console.log("onGameRemoved");
	}

	async onGameStart(gameId){
		console.log("Starting game "+gameId);
		this.io.in(gameId).emit('start');
		console.log("onGameStart");
	}

	async onAllUsersPlayed(gameId){
		this.io.in(gameId).emit('allPlayed');
		console.log("onAllUsersPlayed");
	}

	async onPlayerLeave(gameId,username){
		this.io.in(gameId).emit('left',username);
		console.log("onPlayerLeave");
	}

	async onPlayerWin(gameId,winner){
		this.io.in(gameId).emit('winner',winner);
		console.log("onPlayerWin");
	}

	async onGameOutOfCards(gameId){
		this.io.in(gameId).emit('gameDraw','No more cards left, game is a draw!');
		console.log("onGameOutOfCards");
	}

	async onRoundWon(gameId,username){
		this.io.in(gameId).emit('roundWinner',username);
		console.log("onRoundWon");
	}

	async onNextRound(game){
		this.io.in(game._id).emit('nextRound',game.getSafeVersion());
		console.log("onNextRound");
	}
	
	async onGameStartFailed(gameId,reason='Error'){
		console.error("Game couldn't start because "+reason);
		this.io.in(gameId).emit('error',reason);
		console.log("onGameStartFailed");
	}

	async onCardZarTimeOut(gameId){
		this.io.in(gameId).emit('noZarChoice','Card Zar has timed out before making a choice!');
		console.log("onCardZarTimeOut");
	}

	async onSettingUpdate(gameId,settings){
		this.io.in(gameId).emit('updateSetting',settings);
		console.log("onSettingUpdate");
	}

	async onCardPacksUpdate(gameId,cardpack,cardPacks){
		this.io.in(gameId).emit('updateCardPacks',cardpack);

		this.io.in('lobby').emit('updateCardPacks',{
			id:gameId,
			cardPacks:cardPacks
		});
		console.log("onCardPacksUpdate");
	}

	async onNewOwner(socket){
		socket.emit('owner');
		console.log("onNewOwner");
	}

	async onNewZar(socket,gameId,cardZar){
		socket.emit('zar',gameId);
		this.io.in(gameId).emit('onNewZar',cardZar);
		socket.in(gameId).emit('noZar');
		console.log("onNewZar");
	}

	async onHandChanged(socket,cards){
		socket.emit('updateHand',cards);
		console.log("onHandChanged");
	}

	async onRoundEnd(gameId,winner){
		this.io.in(gameId).emit('displayPlayed',winner);
		console.log("onRoundEnd");
	}

	async onNewMessage(gameId,message){
		this.io.in(gameId).emit('newMessage',message);
		console.log('newMessage');
	}
}

module.exports = Callbacks;