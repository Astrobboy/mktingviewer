
function cambiar_url(){
	var url = localStorage.getItem('url');
	location.replace(url);
}

setTimeout(cambiar_url, 15000);
