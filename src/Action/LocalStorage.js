import $ from 'jquery';

const ls = function(){
	this.set = function(a,b){
		if (typeof(Storage) !== "undefined") {
			window.localStorage.setItem(a,b);
		} else {
		    console.log('NO STORAGE');
		}
	}
	this.get = function (a){
		if (typeof(Storage) !== "undefined") {
			return window.localStorage.getItem(a);
		} else {
		    console.log('NO STORAGE');
		}
	}
	this.remove = function (a){
		if (typeof(Storage) !== "undefined") {
			return window.localStorage.removeItem(a);
		} else {
		    console.log('NO STORAGE');
		}
	}
	this.ajaxOpt = {
		url: window.helmi.api + 'dashboard',
		type:'POST',
		data:{
			accesstoken:window.helmi.accesstoken
			,version:window.helmi.version
			,system:window.helmi.system
		},
		dataType:'json',
		success:function(data){

		},
		error:function(xhr){

		}
	};
	this.sendAjax = function(obj){
		const OBJ = Object.assign({},this.ajaxOpt , obj );
		$.ajax( OBJ );
	}
	return this;
}
const LS = new ls();
export default LS;