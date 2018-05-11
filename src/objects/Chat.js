const striptags = require('striptags');
const {MAX_MESSAGES,MAX_MESSAGE_LENGTH} = require('../config/constants.js');

class Message{
	constructor(sender,message){
		this.sender = sender;
		this.message = striptags(message);
		this.message = this.message.substr(0,MAX_MESSAGE_LENGTH);
	}

	toString(){
		return this.sender + ": "+ this.message;
	}
}

class Chat{
	constructor(gameid,callbacks){
		this._id = gameid;
		this.callbacks = callbacks;
		this.messages = [];
	}

	send(sender,message){
		let msg = new Message(sender,message);
		if(this.messages >= MAX_MESSAGES){
			this.messages.shift();	
		}
		this.messages.push(msg);
		this.callbacks.onNewMessage(this._id,msg.toString());
	}

	getAll(){
		let out = ["Welcome, you can chat with others in the game here!"];
		for(let i = 0; i < this.messages.length; i++){
			out.push(this.messages[i].toString());
		}
		return out;
	}
}

module.exports = Chat;