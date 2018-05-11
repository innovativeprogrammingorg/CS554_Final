import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './WhiteCard.css';

class WhiteCard extends Component{
	constructor(){
		super();
		this.state = {
			selected:false
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
	getStyle(){
		return {
			borderColor: (this.state.selected ? 'blue' : 'black'),
			float: (this.props.float)? 'left' : 'none'

		};
	}
	render(){
		return (
			<div style={this.getStyle() } 
				 className={this.props.selectable ? "whiteCardSelectable whiteCard" : "whiteCard" } onClick={this.onSelect.bind(this)}>
				{this.renderText()}
			</div>
		);
	}
}

WhiteCard.defaultProps = {
	float:true
};

WhiteCard.propTypes = {
  	text: PropTypes.string,
  	visible: PropTypes.bool,
  	selectable:PropTypes.bool,
  	onSelect:PropTypes.func,
  	float:PropTypes.bool
};

export default WhiteCard;