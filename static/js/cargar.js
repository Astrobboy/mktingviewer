var clave = 'lista_videos',
	cont = 0,
	clave_cont = 'cont';
function carga(){
	var list= document.getElementsByClassName("video"),
	    array_de_videos = [];
	console.log(list);
	for (var i = 0; i < list.length; i++) {
	    array_de_videos.push(list[i].textContent);
	}
	localStorage.setItem(clave, array_de_videos);
	localStorage.setItem(clave_cont, cont);
	location.replace("http://127.0.0.1:5000/video/"+array_de_videos[cont]);
}
