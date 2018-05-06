import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlackCard from '../BlackCard';
import './GameActionBar.css';

class GameActionBar extends Component{
	render(){
		return (
			<div className="gameActionBar">
				<BlackCard text={this.props.blackCard} />
				<button type="button" className="action_bar_button" name="confirm_selection" id="confirm_selection" 
					    onClick={this.props.onConfirmSelection}>Confirm Selection</button>
			</div>
			);
	}
}

GameActionBar.propTypes = {
	blackCard: PropTypes.string,
	onConfirmSelection: PropTypes.func
};

export default GameActionBar;