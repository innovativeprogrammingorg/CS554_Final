import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<header>
					<h1 class="header">CS554 Final Project</h1>
				</header>
				<main>
					{this.props.children}
				</main>
			</div>
		);
	}
}

export default App;
