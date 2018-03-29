import React from 'react';
import User from './objects/user.js';
import {getUser,userExists,getGame} from '../utils/database.js';
import {Route, Redirect} from 'react-router'


class Authentication{

	static async authUser(username, password, cb){
		try{
			let result = await getUser(username);
			let user = new User(result.username,result.password,result.salt);
			let out = await user.verify(password);
			cb(out);
		}catch(err){
			console.log(err);
		}	
	}

	static async authGuest(name,cb){
		try{
			let result = await userExists(name);
			cb(!result);
		}catch(err){
			console.log(err);
		}
	}

	static async authGame(game_id,game_password,cb,password_cb){
		try{
			let game = await getGame(game_id);
			if(!game.hasRoom()){
				cb(false);
				return;
			}
			if(!(game_password === game.settings.password)){
				password_cb(game_id,(game_password === ""));
			}else{
				cb(true);
			}
		}catch(err){
			console.log(err);
		}
		
	}
}

export const UserRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isUserAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default Authentication;