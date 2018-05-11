/**
 * An array wrapper with additional functionality built in 
 */
class DArray{

	constructor(...args){
		this.data = [];
		for(let i = 0;i < args.length;i++){
			this.data[i] = args[i];
		}
	}
	
	at(index){
		return this.data[index];
	}

	move(index1,index2){
		this.data[index2] = this.data[index1];
	}

	swap(index1,index2){
		let val = this.data[index2];
		this.move(index1,index2);
		this.data[index1] = val;
	}

	update(index,val){
		this.data[index] = val;
	}

	length(){
		return this.data.length;
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
		if(index >= this.length()){
			throw new Exception('ArrayOverflowException');
		}
		if(index < 0 ){
			throw new Exception('ArrayUnderflowException');
		}

		let out = this.at(index);
		for(let i = index;i < this.length();i++){
			this.move(i+1,i);
		}
		this.data.pop();
		return out;

	}

	removeByValue(value){
		this.remove(this.find2(value));
	}
	
	removeByFunc(prop,comp_func){
		let index = -1;
		for(let i = 0;i<this.length();i++){
			if(comp_func(this[i],prop)){
				index = i;
				break;
			}
		}
		if(index != -1){
			this.remove(index);
		}
	}
	removeByProperty(property_name,value){
		let index = -1;
		for(let i = 0;i<this.length();i++){
			if(this.data[i][property_name] == value){
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
		this.data.push(obj);
	}

	toArray(){
		return this.data;
	}

	lookup(property_name,value){
		for(let i = 0;i<this.data.length;i++){
			if(this.data[i][property_name] == value){
				return this.data[i];
			}
		}
		return null;
	}

	find(property_name,value){
		for(let i = 0;i<this.data.length;i++){
			if(this.data[i][property_name] == value){
				return i;
			}
		}
		return -1;
	}

	find2(value){
		for(let i = 0;i<this.data.length;i++){
			if(this.data[i] == value){
				return i;
			}
		}
		return -1;
	}
}



module.exports = DArray;