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
			<div>
				<h1 className="login">Welcome</h1>
				<form className="login" method="POST">
					
					
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
						<input type="submit" name="login" className="login_button" value="Login" onClick={()=>{this.handleLogin.bind(this)}} />
					</div>
					<a className="login" href="/create"><h2 className="login">Click Here to Create an Account</h2></a>
					<h2 className="login">Continue as a guest</h2>
					<p className="guest_name">
						<label htmlFor="guest_name" className="login">Name</label>
						<span><input type="text" name="guest_name" id="guest_name" className="guest_name" ref={(c) => this.guest_user_name = c}/>
						<input type="submit" name="guest" className="guest_login_button" value="Go" 
									onClick={()=>{this.handleGuestLogin.bind(this)}} autoComplete="guest_username"/>
						</span>
					</p> 

					
				</form>
			</div>
			);
	}
}

export default Login;