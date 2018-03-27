import React, { Component } from 'react';
import PropTypes from 'prop-types';


class BlackCard extends Component{
	render(){
		return (
			<div className="Black_Card">
				<p className="Black_Card Card_Text Black">{this.props.text}</p>
			</div>
			);
	}
}

BlackCard.propTypes = {
  	text: PropTypes.string
};

export default BlackCard;