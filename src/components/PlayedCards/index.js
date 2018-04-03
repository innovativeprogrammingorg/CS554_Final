import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WhiteCard from "../WhiteCard";
import './PlayedCards.css';

class PlayedCards extends Component{
	constructor(){
		super();
		this.state = {
			cards:[],
			usersCards:-1,
			selectable:false,
			choice:-1
		};
	}

	static getDerivedStateFromProps(nextProps,prevState){
		if(!nextProps.cards){
			return null;
		}
		return Object.assign(prevState,nextProps);
	}

	onSelect(choice){
		if(!this.state.selectable || this.state.usersCards !== -1){
			return;
		}
		if(this.state.choice === -1){
			this.setState((prevState,props)=>{
				return Object.assign(prevState,{choice:choice});
			});
			document.getElementById("group"+choice).style.borderColor = "blue";
			this.props.onSelect(choice);
		}else{
			this.setState((prevState,props)=>{
				return Object.assign(prevState,{choice:-1});
			});
			document.getElementById("group"+choice).style.borderColor = "transparent";
			this.props.onSelect(-1);
		}
		
	}

	renderCards(){
		return this.state.allCards.map((cards,i)=>{
			let card_group = cards.map((card,i)=>{
				return(
					<WhiteCard text={card.text} visible={this.props.usersCards} /> 
				);
			});
			return(
				<div onClick={()=>{this.onSelect(i)}} id={"group"+i} className="cardGroup">{card_group}</div>
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
	usersCards: PropTypes.number,
	onSelect: PropTypes.func.isRequired,
	selectable:PropTypes.bool
};

export default PlayedCards;