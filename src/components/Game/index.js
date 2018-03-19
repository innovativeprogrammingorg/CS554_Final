import Game from "./component.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { start_game } from '../../actions/game_actions.js';

const mapStateToProps = (state) => {

	return {
		round: state.game_reducer.round,
		min: state.game_reducer.min,
		sec: state.game_reducer.sec
	};

};

const mapDispatchToProps = (dispatch) => {

  	return bindActionCreators({start_game}, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Game);
