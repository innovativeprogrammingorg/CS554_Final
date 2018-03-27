import React, {Component} from 'react';
import './create_account.css';

class CreateAccount extends Component{
	render(){
		return (
			<form className="create_account" method="POST">
				<h1 className="create_account">Create an account</h1>
				<p className="create_account">
					<label htmlFor="username" className="create_account">Username</label>
					<input type="text" className="create_account" id="username" name="username"/>
				</p>
				<p className="create_account">
					<label htmlFor="password1" className="create_account">Password</label>
					<input type="password" className="create_account" name="password1" id="password1"/>
				</p>
				<p className="create_account">
					<label htmlFor="password2" className="create_account">Password</label>
					<input type="password" className="create_account" name="password2" id="password2"/>
				</p>
				<input type="submit" name="submit" value="Create Account" id="create_account_submit"/>
			</form>
			);

	}
}

export default CreateAccount;