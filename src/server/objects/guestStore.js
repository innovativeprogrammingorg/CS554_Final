

class guestStore{
	constructor(){
		this.guests = [];
	}

	length(){
		return this.guests.length;
	}

	isAvailible(name){
		for(let i = 0; i < this.guests.length; i++){
			if(this.guests[i] === name){
				return false;
			}
		}
		return true;
	}

	remove(name){
		this.guests = this.guests.filter((guest)=>{
			return guest !== name;
		});
	}

	add(name){
		this.guests.push(name);
	}
}




module.exports = guestStore;