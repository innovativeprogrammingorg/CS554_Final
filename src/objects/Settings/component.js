import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Setting from "../Setting/component.js"

class Settings extends Component{

	render(){
		<div className="settings">
			<Setting settings={this.props.settings} />
		</div>
	}
}

Settings.propTypes = {
  	user: PropTypes.string,
  	settings: PropTypes.array
};

export default Settings;

