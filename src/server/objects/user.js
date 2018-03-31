const CONSTANTS = require('../../config/constants.js');

const crypto = require('crypto');
const randomNumber = require('random-number-csprng');

class User{

	constructor(username,password = "",salt=""){
		this.username = username;
		this.password = password;
		this.salt = salt;
	}


	async verify(password){
		return new Promise((resolve,reject)=>{
			crypto.pbkdf2(password,this.salt,CONSTANTS.CRYPTO_ITERATIONS,CONSTANTS.CRYPTO_KEY_LEN,CONSTANTS.CRYPTO_ALG,(err,result)=>{
				if (err) throw err;
				resolve(this.password === result);
				
			});
		});
	}

	async hash(){
		this.salt = await User.generateSalt();
		return new Promise((resolve,reject)=>{
			crypto.pbkdf2(this.password,this.salt,CONSTANTS.CRYPTO_ITERATIONS,CONSTANTS.CRYPTO_KEY_LEN,CONSTANTS.CRYPTO_ALG,(err,result)=>{
				if(err) throw err;
				//console.log("Password has been hashed!");
				this.password = result;
				resolve(true);
			});
		});	
	}

	static async generateSalt(len=CONSTANTS.CRYPTO_KEY_LEN){
		let salt = "";
		for(let i = 0;i<len;i++){
			let c = await randomNumber(0,35);
			if(c<10){
				c += 48;
			}else{
				c += 87;
			}
			salt += String.fromCharCode(c);
		}
		return salt;
	}

}


module.exports = User;