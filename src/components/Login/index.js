import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
import './login.css';

class Login extends Component{
	constructor(){
		super();
		this.socket = io.connect('localhost:8989');
		this.socket.on('login',(valid)=>{
			if(valid){
				window.location = '/lobby';
			}else{
				alert("Incorrect username or password");
			}
		});
		this.socket.on('guestLogin',(valid)=>{
			if(valid){
				window.location = '/lobby';
			}else{
				alert("Name is already taken");
			}
		})
	}
	handleLogin(){
		this.socket.emit('login',{
			username:document.forms.login.username.value,
			password:document.forms.login.password.value
		});
	}

	handleGuestLogin(){
		this.socket.emit('guestLogin',document.forms.login.guestName.value);
	}

	render(){

		return (
			<div>
				<h1 className="login">Welcome</h1>
				<form name="login" className="login">
					
					<div className="login">
						<h2 className="login">Please Login</h2>
						<p className="login">
							<label htmlFor="username" className="login">Username</label>
							<input type="text" name="username" id="username" className="login" ref={(c) => this.username = c} autoComplete="username"/>
						</p>
						<p className="login">
							<label htmlFor="password" className="login">Password</label>
							<input type="password" name="password" id="password" className="login" ref={(c) => this.password = c} autoComplete="passwords" />
						</p>
						<button type="button" name="login" className="login" onClick={this.handleLogin.bind(this)} >Login </button>
					</div>
					<Link to="/create"><h2 className="login">Click Here to Create an Account</h2></Link>
					<h2 className="login">Continue as a guest</h2>
					<p className="guestName">
						<label htmlFor="guestName" className="login">Name</label>
						<span><input type="text" name="guestName" id="guestName" className="guestName" ref={(c) => this.guest_user_name = c}/>
						<button type="button" name="guest" className="guest_login_button"  
									onClick={this.handleGuestLogin.bind(this)} autoComplete="guest_username">Go</button>
						</span>
					</p> 

					
				</form>
			</div>
			);
	}
}


export default Login;