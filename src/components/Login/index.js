import React, {Component} from 'react';
import './login.css';
class Login extends Component{
	handleLogin(e){
		e.preventDefault();
	}
	handleGuestLogin(e){
		e.preventDefault();
	}
	render(){
		return (
			<form className="login" method="POST"}>
				<h1 className="login">Welcome</h1>
				
				<div className="login">
				<h2 className="login">Please Login</h2>
					<p className="login">
						<label htmlFor="username" className="login">Username</label>
						<input type="text" name="username" id="username" className="login" ref={(c) => this.username = c}/>
					</p>
					<p className="login">
						<label htmlFor="password" className="login">Password</label>
						<input type="password" name="password" id="password" className="login" ref={(c) => this.password = c} />
					</p>
					<input type="submit" name="login" className="login_button" value="Login" onclick={()=>{this.handleLogin.bind(this)}} />
				</div>
				<a className="login" href="#"><h2 className="login">Click Here to Create an Account</h2></a>
				<h2 className="login">Continue as a guest</h2>
				<p className="login">
					<label forName="guest_name" className="login">Name</label>
					<input type="text" name="guest_name" className="login" ref={(c) => this.guest_user_name = c}/>
					<input type="submit" name="guest" className="guest_login_button" value="Go" onclick={()=>{this.handleGuestLogin.bind(this)}}/>
				</p> 

			</form>
			);
	}
}

export default Login;