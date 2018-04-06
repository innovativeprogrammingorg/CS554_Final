import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './chatlist.css';


class ChatList extends Component{
	constructor(){
		super();
		this.state = {
			history:[]
		};
	}
	static getDerivedStateFromProps(nextProps,prevState){
		if(nextProps.history === null){
			return null;
		}
		return nextProps;
	}
	renderMessages(){
		return this.state.history.map((msg,i) =>{
	        return (
	          	<div className="message" >
	          		<p className="message"><span className="username">{msg.user}</span>: {msg.message}</p>
	        	</div>
	        );
	    });
	}
	render(){
		return (
			<div className="message_history">
				{this.renderMessages()}
			</div>
		);
	}
}

ChatList.propTypes = {
  	history: PropTypes.array
};

export default ChatList;