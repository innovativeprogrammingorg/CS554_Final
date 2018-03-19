
class Player{

	constructor(name){
		this.name = name;
		this.score = 0;
		this.is_zar = false;
	}

	award_point(){
		this.score++;
	}
}

export default Player;