import Settings from "./component.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {init_settings} from '../actions/settings_actions.js';

const mapStateToProps = (state) => {

	return {
		settings: state.settings_reducer.settings,
		settings_values: state.settings_reducer.settings_values
	};

};

const mapDispatchToProps = (dispatch) => {

  	return bindActionCreators({init_settings}, dispatch);
};
export default connect(mapStateToProps,mapDispatchToProps)(Settings);
