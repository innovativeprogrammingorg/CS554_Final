import React, {Component} from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import './toppanel.css';
class TopPanel extends Component{
	logout(){
		this.socket = io('http://localhost:8989');
		this.socket.open();
		this.socket.on('loggedOut',()=>{
			console.log("Logged out!");
			window.location = '/';
		});
		this.socket.emit('logout');

	}
	render(){
		switch(this.props.location){
			case 'game':
				return(
					<nav>
						<button className="nav" onClick={this.props.startGame}>Start Game</button>
						<button className="nav" onClick={this.props.leaveGame}>Leave Game</button>
						<button className="logout" onClick={this.logout.bind(this)}>Logout</button>
					</nav>
					);
			case 'lobby':
				return(
					<nav>
						<button className="nav" onClick={this.props.createGame}>Create Game</button>
						<button className="logout" onClick={this.logout.bind(this)}>Logout</button>
					</nav>
					);
			default:
				return(
					<nav>
						<button className="logout" onClick={this.props.logout.bind(this)}>Logout</button>
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
	createGame:PropTypes.func,
	leaveGame:PropTypes.func
};

export default TopPanel;