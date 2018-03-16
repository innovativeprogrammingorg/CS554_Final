import React, { Component } from 'react';
import PropTypes from 'prop-types';


class White_Card extends Component{
	render(){
		return (
			<div className="White_Card">
				<p className="White_Card Card_Text White">{this.props.text}</p>
			</div>
		);
	}
}

Search.propTypes = {
  	text: PropTypes.string
};

export default White_Card;