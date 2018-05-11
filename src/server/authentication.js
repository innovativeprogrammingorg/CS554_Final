const User = require('./objects/user.js');
const db = require('../utils/database.js');

class Authentication{
	static init(){
		db.init();
	}
	static async authUser(username, password, cb){
		try{
			let result = await db.getUser(username);
			let user = new User(result.username,result.password.buffer,result.salt);
			let out = await user.verify(password);
			cb(out);
		}catch(err){
			console.log("auth error")
			console.log(err);
			cb(false);
		}	
	}

	static async authGuest(name,cb){
		try{
			let result = await db.userExists(name);
			cb(!result);
		}catch(err){
			console.log(err);
			cb(false);
		}
	}

	static async createUser(username,password,cb){
		try{
			let result = await db.userExists(username);
			if(result){
				console.log("Cannot create a user which already exists!");
				cb(false);
				return;
			}
			let user = new User(username,password);
			user.hash().then(()=>{
				db.insertUser(user);
				cb(true);
			}).catch((err)=>{
				console.log(err);
				cb(false);
			});
			
		}catch(err){
			console.log(err);
			cb(false);
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