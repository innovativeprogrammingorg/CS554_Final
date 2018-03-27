import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WhiteCard from "../WhiteCard";


class PlayedCards extends Component{
	renderCards(){
		return this.props.cards.map((card,i)=>{
			return(
				<WhiteCard text={card.text} visible={this.props.usersCards} /> 
				);
			
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

class PlayedCardsMain extends Component{
	renderCards(){
		return this.props.allCards.map((cards,i)=>{
			return(
					<WhiteCard cards={cards} usersCards = {i === this.props.usersCards}/>
				);
			
		});
	}

	render(){
		return(
			<div id="player_hand">{this.renderCards()}</div>
		);
	}
}

PlayedCards.propTypes = {
	cards: PropTypes.array,
	usersCards: PropTypes.bool
};

PlayedCardsMain.propTypes = {
	allCards: PropTypes.array,
	usersCards: PropTypes.number  	
};

export default PlayedCardsMain;