var clave = 'lista_videos',
	cont = 0,
	clave_cont = 'cont';
function carga(){
	var list= document.getElementsByClassName("video"),
	    array_de_videos = [];
	for (var i = 0; i < list.length; i++) {
	    array_de_videos.push(list[i].textContent);
	}
	console.log(array_de_videos);
	localStorage.setItem(clave, array_de_videos);
	localStorage.setItem(clave_cont, cont);
	location.replace("http://192.168.100.21/video/"+array_de_videos[cont]);
}
