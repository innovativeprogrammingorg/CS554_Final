import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CARD_PACKS from '../../data/cards/card_packs.js';
import io from 'socket.io-client';
import './cardpacks.css';

class CardPacks extends Component{

	constructor(){
		super();
		this.state = {
			pack_values:{},
			packs:[]
		};
		for(let i = 0; i < CARD_PACKS.length;i++){
			this.state.packs.push(CARD_PACKS[i]); 
			this.state.pack_values[CARD_PACKS[i]] = false; 
		}
	}

	componentWillMount(){
		this.initSocket();
	}

	componentWillUnMount(){
		this.socket.close();
	}

	static getDerivedStateFromProps(nextProps,prevState){
		if(! nextProps.cardpacks){
			return null;
		}
		let state = prevState;
		for(let i = 0;i<state.packs.length;i++){
			state.pack_values[state.packs[i]] = false;
		}
		for(let i = 0;i<nextProps.cardpacks.length;i++){
			state.pack_values[nextProps.cardpacks[i]] = true;
		}
		return state;
		
	}

	initSocket(){
		this.socket = io('http://localhost:8989');

		this.socket.on('updateCardPacks',(msg)=>{
			if(this.props.editable){
				console.log('Change on card pack '+msg+' ACK');
				return;
			}
			this.setState((prevState,props)=>{
				let pack_values = prevState.pack_values;
				pack_values[msg] = !(pack_values[msg]);
				return{
					pack_values:pack_values,
					packs:prevState.packs
				};
			});
		});

		this.socket.open();
	}
	
	onChange(name){
		if(!this.props.editable){
			alert('Only the game owner can edit settings');
			return;
		}
		let pack = name.replace(/(_)+/g,' ');
		let val = document.forms.settings[name].checked;
		this.setState((prevState,props)=>{
			let state = prevState;
			state.pack_values[pack] = val;
		});
		this.socket.emit('updateCardPacks',pack);
	}

	onAddExternal(){
		alert('External Card Packs are not support right now');
	}

	columns(){
		let columns = Math.floor(CARD_PACKS.length/8);
		return {columnCount:columns};
	}

	renderExternalCPInput(){
		return (
			<div className="external_card_pack">
				<input type="url" name="external_card_pack" id="external_card_pack" disabled={this.props.editable} />
				<input type="button" name="submit_external" id="submit_external" value="Add Pack" disabled={this.props.editable} 
					   onClick={this.onAddExternal}/>
			</div>
		);
	}

	renderCardPacks(){
		return this.state.packs.map((pack,i) =>{
			let name = pack.replace(/\s+/g,'_');
			return (
				<p key={i} className="card_pack">
					<input type="checkbox" name={name} id={name} checked={this.state.pack_values[pack]} disabled={this.props.editable}
						onChange={()=>{this.onChange(name)}}
					/>
					<label className="card_pack" htmlFor={name}>{pack}</label>
				</p> 
			);
		});
	}

	render(){
		return(
			<div>
				<div className="card_packs" style={this.columns()}>
					{this.renderCardPacks()}
					
				</div>
				{this.renderExternalCPInput()}
			</div>
		);
	}
}

CardPacks.propTypes = {
	cardpacks:PropTypes.array,
	editable:PropTypes.bool
};


export default CardPacks;

