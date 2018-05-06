import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WhiteCard from "../WhiteCard";
import './PlayerHand.css';

class PlayerHand extends Component{

	renderCards(){
		console.log(this.props);
		try{
			return this.props.cards.map((card,i)=>{
				return(
					<WhiteCard selectable={this.props.selectable} onSelect={()=>{this.props.onSelect(i)}} text={card.text}
							   visible={true}/>
				);
				
			});
		}catch(err){
			console.log(err);
		}
		return;
		
	}

	render(){
		return(
			<div id="playerHand">{this.renderCards()}</div>
		);
	}
}

PlayerHand.defaultProps = {
	cards:[]
};

PlayerHand.propTypes = {
	cards:PropTypes.array,
	onSelect:PropTypes.func.isRequired,
	selectable:PropTypes.bool
};
export default PlayerHand;