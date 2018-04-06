import React from 'react';
import {Redirect} from 'react-router'
import './create_account.css';

class CreateAccount extends React.Component{
	constructor(){
		super();
		this.state = {
			redirect:false
		};
	}
	handleAccountCreation(){
		let username = document.forms.createAccount.username.value;
		let password1 = document.forms.createAccount.password1.value;
		let password2 = document.forms.createAccount.password2.value;
		if(password1 !== password2){
			alert('Passwords do not match!');
			return false;
		}
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = ()=>{
			if(xhttp.readyState === 4 && xhttp.status === 200 && xhttp.responseText==="VALID"){
				alert("Success!");
				window.location = '/';
			}else if(xhttp.readyState === 4 && xhttp.status === 200){
				alert("Username is already taken");
			}
		};
		let url = window.location.protocol + "//" + window.location.hostname + ":8989/create/";
		xhttp.open("POST",url,true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("username="+username+"&password="+password1);
		return false;

	}
	render(){

		if(this.state.redirect){
			return <Redirect to="/lobby/" />;
		}
		return (
			<form className="createAccount" name="createAccount">
				<h1 className="createAccount">Create an account</h1>
				<p className="createAccount">
					<label htmlFor="username" className="createAccount">Username</label><br/>
					<input type="text" className="createAccount" id="username" name="username" autoComplete="new-username"/>
				</p>
				<p className="createAccount">
					<label htmlFor="password1" className="createAccount">Password</label><br/>
					<input type="password" className="createAccount" name="password1" id="password1" autoComplete="new-password"/>
				</p>
				<p className="createAccount">
					<label htmlFor="password2" className="createAccount">Re-enter Password</label><br/>
					<input type="password" className="createAccount" name="password2" id="password2" autoComplete="new-password"/>
				</p>
				<button type="button" name="submit" id="createAccountSubmit" onClick={this.handleAccountCreation}>Create Account</button>
			</form>
			);

	}
}

export default CreateAccount;