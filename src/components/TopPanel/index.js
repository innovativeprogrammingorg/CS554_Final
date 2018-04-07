import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import './toppanel.css';

class TopPanel extends React.Component{

	componentWillMount(){
		this.initSocket();
	}
	initSocket(){
		this.socket = io.connect('http://localhost:8989');
		this.socket.open();
		this.socket.on('leftGame',()=>{
			window.location = '/lobby';
		});
		this.socket.on('loggedOut',()=>{
			console.log("Logged out!");
			window.location = '/';
		});
	}

	logout(){
		this.socket.emit('logout');
	}
	leaveGame(){
		this.socket.emit('leaveGame');
	}
	render(){
		switch(this.props.location){
			case 'game':
				return(
					<nav>
						<button className="nav" onClick={this.props.startGame}>Start Game</button>
						<button className="nav" onClick={this.leaveGame.bind(this)}>Leave Game</button>
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
	createGame:PropTypes.func
};

export default TopPanel;