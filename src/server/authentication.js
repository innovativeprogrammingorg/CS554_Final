const User = require('./objects/user.js');
const db = require('../utils/database.js');


class Authentication{

	static async authUser(username, password, cb){
		try{
			let result = await db.getUser(username);
			let user = new User(result.username,result.password,result.salt);
			let out = await user.verify(password);
			cb(out);
		}catch(err){
			console.log(err);
		}	
	}

	static async authGuest(name,cb){
		try{
			let result = await db.userExists(name);
			cb(!result);
		}catch(err){
			console.log(err);
		}
	}

	static async authGame(game_id,game_password,cb,password_cb){
		try{
			let game = await db.getGame(game_id);
			if(!game.hasRoom()){
				cb(false);
				return;
			}
			if(!(game_password === game.settings.password)){
				password_cb(game_id,(game_password === ""));
			}else{
				cb(true);
			}
		}catch(err){
			console.log(err);
		}
		
	}
}

module.exports = Authentication;