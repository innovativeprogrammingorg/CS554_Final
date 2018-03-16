import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Chat_List/component.js'

class Chat extends Component{
	render(){
		return (<div className="Chat">
			<Chat_List user={this.props.user} history={this.props.history}/>
			<form className="msg_sender" onSubmit="">
				<input type="text" id="msg" name="msg">
				<input type="submit" id="send_msg" name="submit" value="send">
			</form>
		</div>);
	}
}

Chat.propTypes = {
  	user: PropTypes.string,
  	history: PropTypes.array
};

export default Chat;

