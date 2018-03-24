import {CRYPTO_KEY_LEN,CRYPTO_ITERATIONS,CRYPTO_ALG} from '../../config/constants.js'

import * as crypto from 'crypto';

import * as randomNumber from 'random-number-csprng';

class User{

	constructor(username){
		this.username = username;
		this.password = '';
		this.salt = '';
	}

	constructor(username,password,salt){
		this.username = username;
		this.password = password;
		this.salt = salt;
	}


	async verify(username,password){
		return new Promise((resolve,reject)=>{
			crypto.pbkdf2(password,this.salt,CRYPTO_ITERATIONS,CRYPTO_KEY_LEN,CRYPTO_ALG,(err,result)=>{
				if (err) throw err;
				resolve(this.password == result);
				
			});
		});
	}

	async hash(password){
		this.salt = await generateSalt();
		await crypto.pbkdf2(password,this.salt,CRYPTO_ITERATIONS,CRYPTO_KEY_LEN,CRYPTO_ALG,(err,result)=>{
			if(err) throw err;
			this.password = result;
		});
	}

	static async generateSalt(){
		let salt = "";
		for(let i = 0;i<KEY_LEN;i++){
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


export default User;