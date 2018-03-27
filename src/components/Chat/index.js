import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatList from '../ChatList';
import './chat.css';

class Chat extends Component{
	render(){
		return (
			<div className="chat">
				<ChatList user={this.props.user} history={this.props.history}/>
				<form className="msg_sender">
					<input type="text" id="msg" name="msg" autoComplete="off"/>
				</form>
			</div>
			);
	}
}

Chat.propTypes = {
  	user: PropTypes.string,
  	history: PropTypes.array
};

export default Chat;

