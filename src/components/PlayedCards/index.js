import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WhiteCard from "../WhiteCard";
import './PlayedCards.css';

class PlayedCards extends Component{
	constructor(){
		super();
		this.state = {
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
		if(!this.props.selectable || this.props.usersCards !== -1){
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
		try{
			return this.props.cards.map((cards,i)=>{
				let card_group = cards.map((card,j)=>{
					return(
						<WhiteCard float={false} key={i+" "+j} text={card.text} selectable={false} 
						visible={this.props.usersCards === j || this.props.displayAll} /> 
					);
				});
				return(
					<div key={i} onClick={()=>{this.onSelect(i)}} id={"group"+i} 
					style={ {'width':(9.5*cards.length)+'vw'}  }
					className="cardGroup">{card_group}</div>
				);	
			});
		}catch(err){
			console.log(err);
			console.log(this.props);
			return;
		}
		
	}

	render(){
		return(
			<div id="playedCards">{this.renderCards()}</div>
		);
	}
}

PlayedCards.defaultProps = {
	cards:[],
	usersCards:-1,
	selectable:false
}

PlayedCards.propTypes = {
	cards: PropTypes.array.isRequired,
	usersCards: PropTypes.number.isRequired,
	onSelect: PropTypes.func.isRequired,
	selectable:PropTypes.bool.isRequired,
	displayAll:PropTypes.bool,
	winner:PropTypes.number
};

export default PlayedCards;