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
						<button className="nav" onClick={this.props.startGame}>Start Game</button>
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
	location:PropTypes.string,
	startGame:PropTypes.func,
	logout:PropTypes.func,
	createGame:PropTypes.func,
	leaveGame:PropTypes.func
};

export default TopPanel;