import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './user.css';

class User extends Component{
	render(){
		/**TODO change look for owner**/
		return (
			<div className="user">
				<p className="user_name" > {this.props.username}</p>
				<p className="user_points">Score {this.props.points}</p>
			</div>
			);
	}
}

User.propTypes = {
  	username: PropTypes.string,
  	points: PropTypes.number
};

export default User;