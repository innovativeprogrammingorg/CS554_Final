import React from 'react';
import { Route, Switch} from 'react-router';

import Lobby from './components/Lobby';
import Main from './components/Main';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
//props.match.params
export default (
	<Switch>
		<Route exact path="/" component={Login} />
		<Route path="/create" component={CreateAccount}/>
		<Route path="/lobby/" component={Lobby}/>
		<Route path="/game/:id" component={Main}/>
	</Switch>
	);
