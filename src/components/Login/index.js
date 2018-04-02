import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import './login.css';

class Login extends Component{
	constructor(){
		super();
		this.state = {
			redirect:false
		};
	}
	redirectState(){
		this.setState({redirect:true});
	}
	handleLogin(){
		let username = document.forms.login.username.value;
		let password = document.forms.login.password.value;
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = ()=>{
			if(xhttp.readyState === 4 && xhttp.status === 200 && xhttp.responseText==="VALID"){
				self.redirectState();
			}else if(xhttp.readyState === 4 && xhttp.status === 200){
				alert("Incorrect username or password");
			}
		};
		let url = window.location.protocol + "//" + window.location.hostname + ":8989/login/";
		xhttp.open("POST",url,true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("username="+username+"&password="+password);
	}
	handleGuestLogin(){
		let guestName = document.forms.login.guestName.value;
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = ()=>{
			if(xhttp.readyState === 4 && xhttp.status === 200 && xhttp.responseText==="VALID"){
				self.setState({redirect:true});
			}else if(xhttp.readyState === 4 && xhttp.status === 200){
				alert("Name is already taken");
			}
		};
		let url = window.location.protocol + "//" + window.location.hostname + ":8989/login/guest/";
		xhttp.open("POST",url,true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("username="+guestName);

	}
	render(){
		if(this.state.redirect){
			return <Redirect to="/lobby/" />;
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
					<p className="guestName">
						<label htmlFor="guestName" className="login">Name</label>
						<span><input type="text" name="guestName" id="guestName" className="guestName" ref={(c) => this.guest_user_name = c}/>
						<button type="button" name="guest" className="guest_login_button"  
									onClick={this.handleGuestLogin} autoComplete="guest_username">Go</button>
						</span>
					</p> 

					
				</form>
			</div>
			);
	}
}


export default Login;