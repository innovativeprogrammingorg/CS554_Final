/**
 * A simulated dynamic array which contains methods for array manulation which are more 
 * relevant to this game
 */
class DArray{

	constructor(){
		this.length = 0;
	}

	constructor(...args){
		this.length = args.length;
		for(let i = 0;i < args.length;i++){
			this[i] = args[i];
		}
	}
	/**
	 * Gives this object array-like functionality
	 */
	[Symbol.iterator](){
		return Object.keys(this).map(key=>this[key]).values();
	}

	/**
	 * Removes the element at the given index
	 * @param  {Integer} index The index of the element to be deleted
	 * @return {Any}           The deleted element
	 */
	remove(index){
		if(typeof index != 'number'){
			throw new Exception('InvalidArgumentException');
		}
		if(index >= length){
			throw new Exception('ArrayOverflowException');
		}
		if(index < 0 ){
			throw new Exception('ArrayUnderflowException');
		}

		let out = this[index];
		this.length--;
		for(let i = index;i < this.length;i++){
			this[i] = this[i+1];
		}
		return out;

	}
	remove(prop,comp_func){
		let index = -1;
		for(let i = 0;i<this.length;i++){
			if(comp_func(this[i],prop)){
				index = i;
				break;
			}
		}
		if(index != -1){
			this.remove(index);
		}
	}
	removeByProperty(prop,attribute){
		let index = -1;
		for(let i = 0;i<this.length;i++){
			if(this[i][property_name] == value){
				index = i;
				break;
			}
		}
		if(index != -1){
			return this.remove(index);
		}
		return -1;
	}

	append(obj){
		this[this.length] = obj;
		this.length++;
	}

	toArray(){
		let out = [];
		for(let i = 0;i<this.length;i++){
			out.push(this[i]);
		}
		return out;
	}

	lookup(property_name,value){
		for(let i = 0;i<this.length;i++){
			if(this[i][property_name] == value){
				return this[i];
			}
		}
		return null;
	}
}