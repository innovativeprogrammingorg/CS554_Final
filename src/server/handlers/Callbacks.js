
class Callbacks{
	
	constructor(io){
		this.io = io;
	}

	exportCallbacks(){
		return {
			onMaxCapacity:this.onServerFull,
			onSpaceAvailible:this.onServerHasRoom,
			onGameStart:this.onGameStart,
			onGameCreate:this.onGameCreate,
			onGameRemoved: this.onGameRemoved,
			onGameStartFailed:this.onGameStartFailed,
			game:{
				onAllUsersPlayed:this.onAllUsersPlayed,
				onPlayerWin:this.onPlayerWin,
				onOutOfCards:this.onGameOutOfCards,
				onPlayerLeave:this.onPlayerLeft,
				onRoundWon:this.onRoundWon,
				onNextRound:this.onNextRound,
				onCardZarTimeOut:this.CardZarTimeOut,
				onSettingUpdate:this.onSettingUpdate,
				onCardPacksUpdate:this.onCardPacksUpdate,
				onNewOwner:this.onNewOwner,
				onNewZar:this.onNewZar,
				onHandChanged:this.onHandChanged,
				onRoundEnd:this.onRoundEnd
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
		this.io.in('lobby').emit('game',game);
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