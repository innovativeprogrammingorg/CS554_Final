import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WhiteCard from "../WhiteCard";
import 'PlayerHand.css';

class PlayerHand extends Component{
	constructor(){
		super();
		this.state = {
			selected:[]
		};
	}
	renderCards(){
		return this.props.cards.map((card,i)=>{
			return(
				<WhiteCard selectable={selectable} onSelect={()=>{this.props.onSelect(i)}} text={card.text}
						   visible={true}/>
			);
			
		});
	}

	render(){
		return(
			<div id="playerHand">{this.renderCards()}</div>
		);
	}
}


PlayerHand.propTypes = {
	cards:PropTypes.array,
	onSelect:PropTypes.func.isRequired,
	maxCards:PropTypes.number,
	selectable:PropTypes.bool
};
export default PlayerHand;