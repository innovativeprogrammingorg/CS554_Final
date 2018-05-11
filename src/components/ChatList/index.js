import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './chatlist.css';


class ChatList extends Component{

	renderMessages(){
		return this.props.history.map((msg,i) =>{
	        return (
	          	<div key={i} className="message" >
	          		<p className="message">{msg}</p>
	        	</div>
	        );
	    });
	}
	render(){
		return (
			<div className="messageHistory">
				{this.renderMessages()}
			</div>
		);
	}
}

ChatList.defaultProps = {
	history: []
};

ChatList.propTypes = {
  	history: PropTypes.array
};

export default ChatList;