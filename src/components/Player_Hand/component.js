import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WhiteCard from "../White_Card/component.js";

class PlayerHand extends Component{
	renderCards(){
		return this.props.cards.map((card,i)=>{
			return(
					<WhiteCard text={card.text}/>
				);
			
		});
	}

	render(){
		return(
			<div id="player_hand">{this.renderCards()}</div>
			);
	}
}

PlayerHand.propTypes = {
	cards: PropTypes.array  	
};

export default PlayerHand;