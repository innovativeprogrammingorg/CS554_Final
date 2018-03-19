import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Card_Pack extends Component{
	render(){
		return this.props.packs.map((pack,i) =>{
			return (
				<p className="card_pack">
					<label className="card_pack" for={pack.name}>{pack.display_name}</label>
					<input type="checkbox" name={pack.name} id={pack.name} />
				</p> 
			);
		});
	}
}

class External_Card_Pack extends Component{

	render(){
		return (
			<div className="external_card_pack">
				<input type="url" name="external_card_pack" id="external_card_pack" />
				<input type="button" name="submit_external" id="submit_external" />
			</div>
		);
	}
}

class Card_Packs extends Component{

	render(){
		return(
			<div className="card_packs">
				<Card_Pack pack={pack} />
				<External_Card_Pack />
			</div>
		);
	}
}

Card_Packs.propTypes = {
  	card_packs: PropTypes.array
};

Card_Pack.propType = {
	packs : PropTypes.array
};

export default Card_Packs;

