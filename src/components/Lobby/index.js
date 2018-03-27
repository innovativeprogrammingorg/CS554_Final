import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Game from '../Game';
import TopPanel from '../TopPanel';
import './lobby.css';


class Lobby extends Component{
		renderGames(){
			return this.props.games.map((game,i)=>{
				return (
					<Game gameName={game.name} no_players={game.no_players}
						  started={game.started} players={game.players}
						  card_packs={game.card_packs} goal={game.goal}
						  spectators={game.spectators}/>
				);
			});
		}
		render(){
			return (
				<div class="lobby_main">
					<TopPanel location={'lobby'}/>
					<div class="games">
						{this.renderGames()}
					</div>
				</div>
			);
			
		}
}

Lobby.defaultProps = {
	games:[]
};

Lobby.propTypes = {
	games:PropTypes.array
};

export default Lobby;