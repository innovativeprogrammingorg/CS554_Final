import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CARD_PACKS from '../../data/cards/card_packs.js';
import './cardpacks.css';

class CardPack extends Component{
	render(){
		return this.props.packs.map((pack,i) =>{
			let name = pack.replace(/\s+/g,'_');
			return (
				<p key={i} className="card_pack">
					<input type="checkbox" name={name} id={name} />
					<label className="card_pack" htmlFor={name}>{pack}</label>
					
				</p> 
			);
		});
	}
}

class ExternalCardPack extends Component{

	render(){
		return (
			<div className="external_card_pack">
				<input type="url" name="external_card_pack" id="external_card_pack" />
				<input type="button" name="submit_external" id="submit_external" value="Add Pack" />
			</div>
		);
	}
}

class CardPacks extends Component{
	columns(){
		let columns = Math.floor(CARD_PACKS.length/8);
		return {columnCount:columns};
	}
	render(){
		return(
			<div>
				<div className="card_packs" style={this.columns()}>
					<CardPack packs={CARD_PACKS} />
					
				</div>
				<ExternalCardPack />
			</div>
		);
	}
}

CardPack.propType = {
	packs : PropTypes.array
};

export default CardPacks;

