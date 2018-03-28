import * as MongoClient = from 'mongodb';
import {MONGODB_URL} from '../config/constants.js';
import User from '../server/objects/user.js';

const database = "cah_clone"
const url = MONGODB_URL+database;

export const collections = [
	"users",
	"games"
];

export const init = ()=>{
	try{
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;

		  	for(let i = 0;i<collections.length;i++){
		  		db.createCollection(collections[i], function(err, res) {
			    	if (err) throw err;
			    	console.log("Collection created!");
			    	db.close();
			  	});
		  	}
		});

	}catch(err){

	}
};

export const getUser = (username)=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	db.collection("users").findOne({ username: username },function(error, result) {
			    if (error) throw error;
			    resolve(result);
			    db.close();
			});
		  	
		});
	});
};

export async function userExists(username){
	try{
		let results = await getUser(username);
		return results == null;
	}catch(err){
		throw err;
	}
	
};	

export async function insertUser(user){
	if(userExists(user.username)){
		throw new Error("User already exists");
	}
	await MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection("users").insertOne(user, function(error, res) {
			if (error) throw error;
		    db.close();
	  	});
	});

};

export async function updateUser(user)=>{
	await MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	var myquery = { username: user.username };
	  	var newvalues = { $set: user };
	  	await db.collection("users").updateOne(myquery, newvalues, function(error, res) {
	    	if (error) throw error;
	    	if(res.result.nModified === 0){
	    		throw new Error("No user exists with given username");
	    	}
    		
	    	db.close();
	  	});
	});
	
};

export const removeUser = (username)=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	var my_query = { username: username };
		  	db.collection("users").deleteMany(my_query, function(error, obj) {
		    	if (error) throw error;
		    	if(obj.result.n === 0){
		    		throw new Error("No tasks have been removed");
		    	}
		    	resolve(true);
		    	db.close();
		  	});
		});
	});
}


export const getGame = (game_id)=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	db.collection("games").findOne({ _id: game_id },function(error, result) {
			    if (error) throw error;
			    resolve(result);
			    db.close();
			});
		  	
		});
	});
};

export async function gameExists(game_id){
	try{
		let results = await getUser(game_id);
		return results == null;
	}catch(err){
		throw err;
	}
};	

export async function insertGame(game){
	if(userExists(game._id)){
		throw new Error("Game already exists");
	}
	await MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection("games").insertOne(game, function(error, res) {
			if (error) throw error;
		    db.close();
	  	});
	});

};

export async function updateUser(game)=>{
	await MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	var myquery = { game_id: game._id };
	  	var newvalues = { $set: user };
	  	await db.collection("games").updateOne(myquery, newvalues, function(error, res) {
	    	if (error) throw error;
	    	if(res.result.nModified === 0){
	    		throw new Error("No game exists with given id");
	    	}
    		
	    	db.close();
	  	});
	});
	
};

export const removeGame = (game_id)=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	var my_query = { game_id: _id };
		  	db.collection("games").deleteMany(my_query, function(error, obj) {
		    	if (error) throw error;
		    	if(obj.result.n === 0){
		    		throw new Error("No tasks have been removed");
		    	}
		    	resolve(true);
		    	db.close();
		  	});
		});
	});
}
