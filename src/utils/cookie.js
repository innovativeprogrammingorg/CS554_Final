import io from 'socket.io-client';

class Cookie{
	static makeid() {
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  for (var i = 0; i < 300; i++)
	    text += possible.charAt(Math.floor(Math.random() * possible.length));

	  return text;
	}
	static getCookie(cname) {
	    var name = cname + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	}

	static setCookie(cname, cvalue) {
	    document.cookie = cname + "=" + cvalue + ";path=/";
	}

	static checkCookie() {
	    return "" !== getCookie("cah.sid");
	    
	}

	static sendCookie(socket=null){
		if(socket === null){

		}else{
			
		}
	}
}

export default Cookie;