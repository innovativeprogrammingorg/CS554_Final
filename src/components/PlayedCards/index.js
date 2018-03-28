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
	constructor(){
		super();
		this.state = {
			allCards:[],
			usersCards:0
		};
	}
	renderCards(){
		return this.state.allCards.map((cards,i)=>{
			return(
					<PlayedCards cards={cards} usersCards = {i === this.props.usersCards}/>
				);
			
		});
	}

	render(){
		return(
			<div id="player_hand">{this.renderCards()}</div>
		);
	}
}
PlayedCards.defaultProps = {
	cards:[],
	usersCards:false
}
PlayedCards.propTypes = {
	cards: PropTypes.array,
	usersCards: PropTypes.bool
};



export default PlayedCardsMain;