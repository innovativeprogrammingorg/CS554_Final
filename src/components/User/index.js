import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './user.css';

class User extends Component{
	renderZar(){
		if(this.props.zar){
			return (<p className="userName" > <span>Card Zar</span> {this.props.username}</p>);
		}
		return (<p className="userName" > {this.props.username}</p>);
	}
	render(){
		return (
			<div className="user">
				{this.renderZar()}
				
				<p className="userPoints">Score {this.props.points}</p>
			</div>
			);
	}
}

User.propTypes = {
  	username: PropTypes.string,
  	points: PropTypes.number,
  	zar: PropTypes.bool
};

export default User;