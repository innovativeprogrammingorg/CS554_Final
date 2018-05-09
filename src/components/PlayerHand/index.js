import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WhiteCard from "../WhiteCard";
import './PlayerHand.css';

class PlayerHand extends Component{
	renderHand(){
		if(this.props.isZar === true){
			return (<h1 className="overlay">You are the card zar</h1>);
		}
		return this.renderCards();
	}
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
			<div id="playerHand">{this.renderHand()}</div>
		);
	}
}

PlayerHand.defaultProps = {
	cards:[]
};

PlayerHand.propTypes = {
	cards:PropTypes.array,
	onSelect:PropTypes.func.isRequired,
	selectable:PropTypes.bool,
	isZar:PropTypes.bool
};
export default PlayerHand;