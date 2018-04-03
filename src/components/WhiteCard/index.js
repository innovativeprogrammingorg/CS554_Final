import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'WhiteCard.css';

class WhiteCard extends Component{
	constructor(){
		super();
		this.state = {
			selected:false;
		};
	}
	renderText(){
		if(this.props.visible){
			return (
				<p className="whiteCard">{this.props.text}</p>
			);
		}else{
			return (
				<p className="whiteCard"></p>
			);
		}
		
	}
	onSelect(){
		if(!this.props.selectable || !this.props.visible){
			return;
		}

		this.props.onSelect();
		this.setState((prevState,props)=>{
			return {selected:!prevState.selected};
		});
	}
	render(){
		return (
			<div style={(this.state.selected ?{borderColor:'blue'}:{borderColor:'black'}) } 
				 className="whiteCard" onClick={this.onSelect}>
				{this.renderText()}
			</div>
		);
	}
}

WhiteCard.propTypes = {
  	text: PropTypes.string,
  	visible: PropTypes.bool,
  	selectable:PropTypes.bool,
  	onSelect:PropTypes.func
};

export default WhiteCard;