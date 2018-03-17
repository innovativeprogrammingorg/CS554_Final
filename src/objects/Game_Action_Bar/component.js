import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Black_Card from '../Black_Card/component.js';

class Game_Action_Bar extends Component{
	render(){
		return (
			<div className="game_action_bar">
				<Black_Card text={this.props.black_card} />
				<input type="button" class="action_bar_button" name="confirm_selection" id="confirm_selection" value="Confirm Selection">
			</div>
			)
	}
}

Played_Cards.propTypes = {
	black_card: PropTypes.string
};

export default Game_Action_Bar;