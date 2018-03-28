import React, { Component } from 'react';
import WhiteCard from "../WhiteCard";

class PlayerHand extends Component{
	constructor(){
		super();
		this.state = {
			cards:[]
		};
	}
	componentWillMount(){

	}
	renderCards(){
		return this.state.cards.map((card,i)=>{
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



export default PlayerHand;