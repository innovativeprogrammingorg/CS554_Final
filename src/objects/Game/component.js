import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Game_Action_Bar from '../Game_Action_Bar/component.js';
import Played_Cards from '../Played_Cards/component.js';
import Player_Hand from '../Player_Hand/component.js';

class Game extends Component{
	
	render(){
		return(
			<div className="game">
				<Game_Action_Bar black_card={this.props.black_card} />
				<Played_Cards all_cards={this.props.all_cards} users_cards={this.props.users_cards}/>
				<Player_Hand cards={this.props.hand_cards} />
			</div>
			);
	}
}


Game.propTypes = {	
	all_cards: PropTypes.array,
	users_cards: PropTypes.number,
	hand_cards: PropTypes.array,
	black_card: PropTypes.string
};

export default Game;