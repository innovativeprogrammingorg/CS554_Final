import React, { Component } from 'react';
import PropTypes from 'prop-types';

class User extends Component{
	render(){
		/**TODO change look for owner**/
		return (
			<div key={this.props.keyval} className="User">
				<p className="User" > {this.props.username}</p>
			</div>
			);
	}
}

User.propTypes = {
  	username: PropTypes.string
};

export default User;