export const makeid = ()=>{
  	var text = "";
  	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  	for (var i = 0; i < 70; i++)
    	text += possible.charAt(Math.floor(Math.random() * possible.length));

  	return text;
}
export const getCookie = (cname)=>{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const setCookie = (cname, cvalue)=>{
    document.cookie = cname + "=" + cvalue + ";path=/";
}

export const checkCookie = () => {
    return "" !== getCookie("cah.sid");
    
}

export const sendCookie = (socket=null)=>{
	if(socket === null){

	}else{
		
	}
}


