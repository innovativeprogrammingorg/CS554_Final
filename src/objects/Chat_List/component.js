import React, { Component } from 'react';
import PropTypes from 'prop-types';


import React, { Component } from 'react';

import PropTypes from 'prop-types';


class Chat_List extends Component{
	render(){
		return this.props.history.map((msg,i) =>{
	        return (
	          	<div className="message" >
	          		<p className="message"><span className="username">{msg.user}</span>: {msg.message}</p>
	        	</div>
	        );
	    });
	}
}

Chat_List.propTypes = {
  	user: PropTypes.string,
  	history: PropTypes.array
};

export default Chat_List;