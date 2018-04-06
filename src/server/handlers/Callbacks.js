
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
				onPlayerLeave:this.onPlayerLeft.bind(this),
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
	}

	async onServerHasRoom(){
		this.io.in('lobby').emit('room','Room for more games!');
	}

	async onGameCreate(game){
		try{
			this.io.in('lobby').emit('game',game);
		}catch(err){
			console.error(err);
		}
		
	}

	async onGameRemoved(game_id){
		this.io.in('lobby').emit('removeGame',game_id);
	}

	async onGameStart(game_id){
		this.io.in(game_id).emit('start');
	}

	async onAllUsersPlayed(game_id){
		this.io.in(game_id).emit('allPlayed');
	}

	async onPlayerLeft(game_id,username){
		this.io.in(game_id).emit('left',username);
	}

	async onPlayerWin(game_id,winner){
		this.io.in(game_id).emit('winner',username);
	}

	async onGameOutOfCards(game_id){
		this.io.in(game_id).emit('gameDraw','No more cards left, game is a draw!');
	}

	async onRoundWon(game_id,username){
		this.io.in(game_id).emit('roundWinner',username);
	}

	async onNextRound(game){
		this.io.in(game._id).emit('nextRound',game.getSafeVersion());
	}
	
	async onGameStartFailed(game_id,reason='Error'){
		this.io.in(game_id).emit('error',reason);
	}

	async onCardZarTimeOut(game_id){
		this.io.in(game_id).emit('noZarChoice','Card Zar has timed out before making a choice!');
	}

	async onSettingUpdate(game_id,setting){
		this.io.in(game_id).emit('updateSetting',setting);
	}

	async onCardPacksUpdate(game_id,cardpack){
		this.io.in(game_id).emit('updateCardPacks',cardpack);
	}

	async onNewOwner(socket){
		socket.emit('owner');
	}

	async onNewZar(socket){
		socket.emit('zar');
	}

	async onHandChanged(socket,cards){
		socket.emit('updateHand',cards);
	}

	async onRoundEnd(game_id,winner){
		this.io.in(game_id).emit('displayPlayed',winner);
	}
}

module.exports = Callbacks;