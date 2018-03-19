import React, { Component } from 'react';
import PropTypes from 'prop-types';
import White_Card from "../White_Card/component.js";


class Played_Cards extends Component{
	renderCards(){
		return this.props.cards.map((card,i)=>{
			<White_Card text={card.text} visible={this.props.users_cards} /> 
		});	
	}
	render(){
		return (
			<div className="card_group">
				{this.renderCards()}
			</div>
			);
	}
}

class Played_Cards_Main extends Component{
	renderCards(){
		return this.props.all_cards.map((cards,i)=>{
			<White_Card cards={cards} users_cards = {i == this.props.users_cards}/>
		});
	}

	render(){
		return(
			<div id="player_hand">{renderCards()}</div>
		);
	}
}

Played_Cards.propTypes = {
	cards: PropTypes.array,
	users_cards: PropTypes.bool
};

Played_Cards_Main.propTypes = {
	all_cards: PropTypes.array,
	users_cards: PropTypes.number  	
};

export default Played_Cards_Main;