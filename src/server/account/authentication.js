import User from '../objects/user.js';
import {getUser,userExists,getGame} from '../../utils/database.js';


class Authentication{

	constructor(){
		this.isUserAuthenticated = false;
		this.isGameAuthenticated = false;
	}
	async authUser(username, password, cb){
		try{
			let result = await getUser(username);
			let user = new User(result.username,result.password,result.salt);
			this.isUserAuthenticated = await user.verify(password);
			cb();
		}catch(err){
			console.log(err);
			this.isUserAuthenticated = false;
		}	
	}

	async authGuest(name,cb){
		userExists(name).then((result)=>{
			this.isUserAuthenticated = !result;
			cb();
		}).catch((err)=>{
			console.log(err);
		});
	}

	async authGame(game_id,game_password,cb,password_cb){
		try{
			let game = await getGame(game_id);

			if(!(game_password === game.settings.password)){
				password_cb(game_id,(game_password == ""));
			}else{
				this.isGameAuthenticated = game_id;
				cb();
			}
			
		}catch(err){

		}
		
	}
}



export default Authentication;