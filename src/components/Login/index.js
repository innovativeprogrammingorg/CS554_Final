import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import {Redirect} from 'react-router'
import './login.css';

class Login extends Component{
	constructor(){
		super();
		this.state = {
			redirect:false
		};
	}

	handleLogin(){
		let username = document.forms.login.username.value;
		let password = document.forms.login.password.value;
		let xhttp = new XMLHttpRequest();
		let login = this;
		xhttp.onreadystatechange = ()=>{
			if(this.readyState == 4 && this.status == 200){
				login.setState({redirect:true});
			}else if(this.readyState == 4 && this.status == 403){
				alert("Incorrect username or password");
			}
		};
		xhttp.open("POST","/login",true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("username="+username+"&password="+password);
	}
	handleGuestLogin(){
		let guestName = document.forms.login.guest_name.value;
		auth.authGuest(guestName,()=>{
			this.setState({redirect:true});
		});

	}
	render(){
		if(this.state.redirect){
			return <Redirect to="/" />;
		}

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
						<button type="button" name="login" className="login" onClick={this.handleLogin} >Login </button>
					</div>
					<Link to="/create"><h2 className="login">Click Here to Create an Account</h2></Link>
					<h2 className="login">Continue as a guest</h2>
					<p className="guest_name">
						<label htmlFor="guest_name" className="login">Name</label>
						<span><input type="text" name="guest_name" id="guest_name" className="guest_name" ref={(c) => this.guest_user_name = c}/>
						<button type="button" name="guest" className="guest_login_button"  
									onClick={()=>{this.handleGuestLogin()}} autoComplete="guest_username">Go</button>
						</span>
					</p> 

					
				</form>
			</div>
			);
	}
}


export default Login;