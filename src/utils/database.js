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
		if(typeof id == "undefined"){
			throw new Error("undefined id");
		}
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
	
}	

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

const getR = (id)=>{
	return new Promise((resolve,reject)=>{
		if(typeof id == "undefined"){
			throw new Error("undefined id");
		}
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	db.collection("recipes").findOne({ _id: id },function(error, result) {
			    if (error) throw error;
			    resolve(result);
			    db.close();
			});
		  	
		});
	});
	
}
const update = (id,data)=>{
	return new Promise((resolve,reject)=>{
		if(typeof id == "undefined"){
			throw new Error("undefined id");
		}
		
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	var myquery = { _id: id };
		  	var newvalues = { $set: data };
		  	db.collection("recipes").updateOne(myquery, newvalues, function(error, res) {
		    	if (error) throw error;
		    	if(res.result.nModified === 0){
		    		throw new Error("No task exists with given id");
		    	}
	    		getR(id).then(task=>{
	    			resolve(task);
	    		});
		    	db.close();
		  	});
		});
	});
}
const remove = (id)=>{
	return new Promise((resolve,reject)=>{
		if(typeof id == "undefined"){
			throw new Error("undefined id");
		}
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	var my_query = { _id: id };
		  	db.collection("recipes").deleteMany(my_query, function(error, obj) {
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

