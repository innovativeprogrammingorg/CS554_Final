import {MongoClient} = from 'mongodb';
import {MONGODB_URL} from '../config/constants.js';

const database = "cah_clone"
const url = MONGODB_URL+database;

export const collections = [
	"users"
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

function Comment(poster,comment){
	if(typeof poster != "string" || typeof comment != "string"){
		throw "InvalidArgumentException";
	}
	const uuidv4 = require('uuid/v4');
	this._id = uuidv4();
  	this.poster = poster;
  	this.comment = comment;
}

function Ingredient(name,amount){
	this.name = name;
	this.amount = amount;
}

const createIngredient = (name,amount)=>{
	return new Ingredient(name,amount);
}

const createComment = (poster,comment)=>{
	return new Comment(poster,comment);
}

function Recipe(title,ingredients,steps,comments){
	console.log("Creating recipe object");
	if(typeof title != "string"){
		throw new Error("Bad title");
	}
	if(!(ingredients instanceof Array) || (ingredients.length > 0 && !(ingredients[0] instanceof Ingredient))){
		throw new Error("Bad ingredients");
	}
	if(!(steps instanceof Array) || (steps.length > 0 && typeof steps[0] != "string")){
		throw new Error("bad steps");
	}
	if(!(comments instanceof Array) || (comments.length > 0 && !(comments[0] instanceof Comment))){
		throw new Error("bad comments");
	}
	const uuidv4 = require('uuid/v4');

	this._id = uuidv4();
  	this.title = title;
  	this.ingredients = ingredients;
  	this.steps = steps;
  	this.comments = comments;
  	console.log("Created Recipe object");
}


const createRecipe = (title,ingredients,steps,comments)=>{
	return new Promise((resolve,reject)=>{
		var recipe;
		recipe = new Recipe(title,ingredients,steps,comments);
		 
		console.log(recipe);
		console.log("Adding recipe");
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			db.collection("recipes").insertOne(recipe, function(error, res) {
				if (error) throw error;
			    db.close();
		  	});
		});
		resolve(recipe);
	
	});
}

const getAll = ()=>{
	return new Promise((resolve,reject)=>{
		
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	db.collection("recipes").find({}).toArray(function(error, result) {
		    	if (error) throw error;
		    	resolve(result);
		    	db.close();
		  	});
		});
		
	});
}
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

module.exports = {
	init,init,
	getAll:getAll,
	getR:getR,
	createRecipe:createRecipe,
	createIngredient:createIngredient,
	createComment:createComment,
	update:update,
	remove:remove

}