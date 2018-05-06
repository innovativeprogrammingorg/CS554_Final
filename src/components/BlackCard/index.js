import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './blackcard.css';

class BlackCard extends Component{
	render(){
		return (
			<div className="BlackCard">
				<p className="BlackCard CardText Black">{this.props.text}</p>
			</div>
			);
	}
}

BlackCard.propTypes = {
  	text: PropTypes.string
};

export default BlackCard;