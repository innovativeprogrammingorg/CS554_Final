import React, { Component } from 'react';
import ChatList from '../ChatList';
import io from 'socket.io-client';
import './chat.css';

class Chat extends Component{
	constructor(){
		super();
		this.state = {
			messages:[]
		};
	}

	componentDidMount(){
		this.initSocket();
	}

	componentWillUnmount(){
		this.socket.close();
	}

	initSocket(){
		this.socket = io('http://localhost:8989');

		this.socket.on('connect',()=>{
			this.socket.emit('getMessages');
		});

		this.socket.on('newMessage',(msg)=>{
			
			this.setState((prevState,props)=>{
				let state = prevState;
				state.messages.push(msg);
				return state;
			});
		});

		this.socket.on('messages',(msgs)=>{
			this.setState((prevState,props)=>{
				let state = prevState;
				state.messages = msgs;
				return state;
			});
		});

		this.socket.open();
	}

	checkSubmit(e) {
	    if(e && e.keyCode === 13) {
	    	e.preventDefault();
	   		let message = document.getElementById("msg").value;
	     	this.socket.emit('sendMessage',message);
	     	document.getElementById("msg").value = "";
	    }
	}

	render(){
		return (
			<div className="chat">
				<ChatList history={this.state.messages}/>
				<div className="msg_sender">
					<input type="text" id="msg" name="msg" autoComplete="off" onKeyDown={this.checkSubmit.bind(this)}/>
				</div>
			</div>
			);
	}
}


export default Chat;

