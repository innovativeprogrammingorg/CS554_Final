

/**
 * Dynamic array which allows the deletion of elements at a certain index
 */
class DArray{
	constructor(...args){
		this.length = args.length;
		for(let i = 0;i < args.length;i++){
			this[i] = args[i];
		}
	}
	[Symbol.iterator](){
		return Object.keys(this).map(key=>this[key]).values();
	}
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
	append(obj){
		this[this.length] = obj;
		this.length++;
	}
}