import React, { Component } from 'react';
import PropTypes from 'prop-types';
import White_Card from "../White_Card/component.js";

class Player_Hand extends Component{
	renderCards(){
		return this.props.cards.map((card,i)=>{
			<White_Card text={card.text}/>
		});
	}

	render(){
		return(
			<div id="player_hand">{renderCards()}</div>
			);
	}
}

Player_Hand.propTypes = {
	cards: PropTypes.array  	
};

export default Player_Hand;