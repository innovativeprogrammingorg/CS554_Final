import React, {Component} from 'react';
import './toppanel.css';
class TopPanel extends Component{

	render(){
		return(
			<nav>
				<button className="nav">Start Game</button>
				<button className="nav">Leave Game</button>
				<button className="logout">Logout</button>
			</nav>
			);
		
	}	
}

export default TopPanel;