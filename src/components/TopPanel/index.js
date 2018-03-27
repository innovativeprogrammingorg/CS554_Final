import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './toppanel.css';
class TopPanel extends Component{
	renderActions(){
		
	}
	render(){
		switch(this.props.location){
			case 'game':
				return(
					<nav>
						<button className="nav">Start Game</button>
						<button className="nav">Leave Game</button>
						<button className="logout">Logout</button>
					</nav>
					);
			case 'lobby':
				return(
					<nav>
						<button className="nav">Create Game</button>
						<button className="logout">Logout</button>
					</nav>
					);
			default:
				return(
					<nav>
						<button className="logout">Logout</button>
					</nav>
				);
		}
		
	}	
}

TopPanel.defaultProps = {
	location: 'game'
};

TopPanel.propTypes = {
	location:PropTypes.string
};

export default TopPanel;