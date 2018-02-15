var clave = 'lista_videos',
	clave_cont = 'cont',
	cont = Math.trunc(localStorage.getItem('cont')),
	actual_t = 0,
	clave_actual_t = 'tiempo_actual';
var url_location = window.location;
var url_clave = 'url';
localStorage.setItem(url_clave, url_location);

var video = document.getElementById("demo");
var mostrar = document.getElementById('lista_videos').innerHTML;

if (typeof(localStorage.getItem(clave)) == "string" && localStorage.getItem(clave).indexOf(',') == -1 ){
	var nom_videos = new Array();
	nom_videos.push(localStorage.getItem(clave));
}else{
	if (localStorage.getItem(clave)){
	    mostrar = localStorage.getItem(clave);
	    console.log("hola estoy en mostrar default");
	}else{
	   if (mostrar){
               localStorage.setItem(clave, mostrar);
	       localStorage.getItem(clave);
		console.log("hola estoy en mostrar guardando en el localstorage");
	   }else{
	      location.replace("http://192.168.100.21/selecciona");	
 	   }
	}
	
	if(mostrar.indexOf(',') != -1){
	    var separador = ",";
	}else{
 	    var separador = " ";
      	}	
	var nom_videos = mostrar.split(separador);
	for (var i = nom_videos.indexOf(''); i <= nom_videos.length; i++) {
		if (nom_videos[i] == "" | nom_videos[i+1] == "" ){ 
			nom_videos.splice(i, 1);
			i = nom_videos.indexOf('')-1
		}
	}
}

function duracion(){
	actual_t = video.currentTime;
	localStorage.setItem(clave_actual_t, actual_t);
	var url_location = window.location;
	var url_clave = 'url';
	localStorage.setItem(url_clave, url_location);
}

window.onbeforeunload = function (event) {
		duracion();
}

function verifica(){
	if (localStorage.getItem(clave_actual_t, actual_t)){
		actual_t = Math.trunc(localStorage.getItem(clave_actual_t, actual_t));
		video.currentTime = actual_t;
		var url_clave = 'url';
		var url_location = localStorage.getItem(url_clave);
		return url_location;
	}else{
		return 'http://192.168.100.21/play';
	}
}

window.load = function () {
	var url = verifica();
	location.replace(url);

}



video.addEventListener("ended", function() {
	if (localStorage.getItem(clave)){
		if(localStorage.getItem(clave_cont)){
			cont = Math.trunc(localStorage.getItem('cont'));
			if(cont == (nom_videos.length)-1){
				cont = 0;
				localStorage.setItem(clave_cont, cont);
				location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
			}else{
				cont += 1;
				localStorage.setItem(clave_cont, cont);
				location.replace("http://192.168.100.21/video/"+nom_videos[cont]);	
			};
		}else {
			localStorage.setItem(clave_cont, cont);
			location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
		}

		localStorage.setItem(clave_cont, cont);
		location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
	}else {
		location.replace("http://192.168.100.21/selecciona");
	};
});


if (video.requestFullscreen) {
    video.requestFullscreen();
}
else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
}
else if (video.webkitRequestFullScreen) {
    video.webkitRequestFullScreen();
}
else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
}
