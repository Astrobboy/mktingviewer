setTimeout(cambiar_url(),12000);

function cambiar_url(){
	var url = localStorage.getItem('url');
	location.replace(url);
}