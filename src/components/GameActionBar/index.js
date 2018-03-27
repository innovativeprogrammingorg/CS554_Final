import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlackCard from '../BlackCard';

class GameActionBar extends Component{
	render(){
		return (
			<div className="game_action_bar">
				<BlackCard text={this.props.blackCard} />
				<input type="button" class="action_bar_button" name="confirm_selection" id="confirm_selection" value="Confirm Selection"/>
			</div>
			)
	}
}

GameActionBar.propTypes = {
	blackCard: PropTypes.string
};

export default GameActionBar;