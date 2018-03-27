import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './chatlist.css';


class ChatList extends Component{
	renderMessages(){
		return this.props.history.map((msg,i) =>{
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
  	user: PropTypes.string,
  	history: PropTypes.array
};

export default ChatList;