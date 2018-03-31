
const MONGODB_URL = require('../config/constants.js').MONGODB_URL;
const MongoClient = require('mongodb').MongoClient;

const database_name = "cah_clone"
const url = MONGODB_URL+database_name;

const collections = [
	"users",
	"games"
];

const init = ()=>{
	try{
		MongoClient.connect(url, function(err, database) {
			const db = database.db(database_name);
		  	if (err) throw err;

		  	for(let i = 0;i<collections.length;i++){
		  		db.createCollection(collections[i], function(err, res) {
			    	if (err) throw err;
			    	console.log("Collection created!");
			  	});
		  	}
		  	database.close();
		});

	}catch(err){

	}
};

const getUser = async(username)=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, database) {
			const db = database.db(database_name);
		  	if (err) throw err;
		  	db.collection("users").findOne({ username: username },function(error, result) {
			    if (error) throw error;
			    database.close();
			    resolve(result);
			   	 
			});
		  	
		});
	});
};

const userExists = async(username)=>{
	try{
		let results = await getUser(username);
		return results != null;
	}catch(err){
		throw err;
	}
	
};	

const insertUser = async(user)=>{
	let existCheck = await userExists(user.username);
	if(existCheck){
		throw new Error("User already exists");
	}
	await MongoClient.connect(url, function(err, database) {
		const db = database.db(database_name);
		if (err) throw err;
		db.collection("users").insertOne(user, function(error, res) {
			if (error) throw error;
		    database.close();
	  	});
	});

};

const updateUser = async(user)=>{
	await MongoClient.connect(url, async(err, database)=> {
	  	if (err) throw err;
	  	const db = database.db(database_name);
	  	var myquery = { username: user.username };
	  	var newvalues = { $set: user };
	  	await db.collection("users").updateOne(myquery, newvalues, function(error, res) {
	    	if (error) throw error;
	    	if(res.result.nModified === 0){
	    		database.close();
	    		throw new Error("No user exists with given username");
	    	}
    		
	    	database.close();
	  	});
	});
	
};

const removeUser = async(username)=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, database) {
		  	if (err) throw err;
		  	const db = database.db(database_name);
		  	var my_query = { username: username };
		  	db.collection("users").deleteMany(my_query, function(error, obj) {
		    	if (error) throw error;
		    	database.close();
		    	if(obj.result.n === 0){
		    		throw new Error("No users have been removed");
		    	}
		    	resolve(true);
		  	});
		});
	});
};


const getGame = async(game_id)=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, database) {
		  	if (err) throw err;
		  	const db = database.db(database_name);
		  	db.collection("games").findOne({ _id: game_id },function(error, result) {
			    if (error) throw error;
			    resolve(result);
			    database.close();
			});
		});
	});
};

const gameExists = async(game_id)=>{
	try{
		let results = await getUser(game_id);
		return results != null;
	}catch(err){
		throw err;
	}
};	

const insertGame = async(game)=>{
	let existCheck = await gameExists(game._id)
	if(existCheck){
		throw new Error("Game already exists");
	}
	
	await MongoClient.connect(url, function(err, database) {
		if (err) throw err;
		const db = database.db(database_name);
		db.collection("games").insertOne(game, function(error, res) {
			if (error) throw error;
		    database.close();
	  	});
	});

};

const updateGame = async(game)=>{
	await MongoClient.connect(url, async(err, database)=> {
	  	if (err) throw err;
	  	var myquery = { _id: game._id };
	  	var newvalues = { $set: game };
	  	const db = database.db(database_name);
	  	await db.collection("games").updateOne(myquery, newvalues, function(error, res) {
	    	if (error) throw error;
	    	database.close();
	    	if(res.result.nModified === 0){
	    		throw new Error("No game exists with given id");
	    	}
	  	});
	});
	
};

const removeGame = async(game_id)=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, database) {
		  	if (err) throw err;
		  	const db = database.db(database_name);
		  	var my_query = { _id: game_id };
		  	db.collection("games").deleteMany(my_query, function(error, obj) {
		    	if (error) throw error;
		    	database.close();
		    	if(obj.result.n === 0){
		    		throw new Error("No games have been removed");
		    	}
		    	resolve(true);
		    	
		  	});
		});
	});
};

module.exports = {
	init:init,
	getUser:getUser,
	userExists:userExists,
	insertUser:insertUser,
	updateUser:updateUser,
	removeUser:removeUser,
	getGame:getGame,
	gameExists:gameExists,
	insertGame:insertGame,
	updateGame:updateGame,
	removeGame:removeGame

};