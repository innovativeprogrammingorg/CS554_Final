import React, { Component } from 'react';
import PropTypes from 'prop-types';


class WhiteCard extends Component{
	renderText(){
		if(this.props.visible){
			return (
				<p className="White_Card Card_Text White">{this.props.text}</p>
			);
		}else{
			return (
				<p className="White_Card Card_Text White"></p>
			);
		}
		
	}
	render(){
		return (
			<div className="White_Card">
				{this.renderText()}
			</div>
		);
	}
}

WhiteCard.propTypes = {
  	text: PropTypes.string,
  	visible: PropTypes.bool
};

export default WhiteCard;