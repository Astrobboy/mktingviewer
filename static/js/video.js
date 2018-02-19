var clave_lista_videos = 'lista_videos',
	clave_cont = 'cont',
	cont = Math.trunc(localStorage.getItem('cont')),
	tiempo_actual = 0,
	clave_tiempo_actual = 'tiempo_actual',
	duracion_video = 0,
	clave_duracion_video = 'termina_en';

var nom_videos = new Array();
var url_location = window.location;
var url_clave = 'url';

var video = document.getElementById("demo");


var socket = io.connect('http://' + document.domain + ':' + location.port);


function verifica(){
	tiempo_actual = localStorage.getItem(clave_tiempo_actual);
	localStorage.setItem(clave_duracion_video ,video.duration);
	if (tiempo_actual != 0){
		video.currentTime = tiempo_actual;
		localStorage.setItem(clave_tiempo_actual, '0');
	}
}


function duracion(){
	if (video.currentTime == video.duration){
		tiempo_actual = 0;
	}else{
		tiempo_actual = video.currentTime ;
	}
	localStorage.setItem(clave_tiempo_actual, tiempo_actual);
	localStorage.setItem(url_clave, url_location);
}

window.onbeforeunload = function (event) {
		duracion();
}

function prueba(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET","http://127.0.0.1:5000/1");
	xhr.send();
	xhr.onreadystatechange = function() {
	    if(xhr.readyState == 4 && xhr.status == 200){
	    	localStorage.setItem(clave_lista_videos, JSON.parse(xhr.responseText));
	        console.log(xhr.responseText);
	    }
	}
}


//sockets
/*
socket.on("lista", (data) => {
	localStorage.setItem(clave_lista_videos, JSON.parse(data));
	console.log("recibi los datos");	
	reconnection: false;
});
*/
prueba()


video.addEventListener("ended", function() {
	localStorage.setItem(clave_tiempo_actual, '0');
	nom_videos = JSON.parse((localStorage.getItem(clave_lista_videos)));	
	if(Math.trunc(localStorage.getItem(clave_tiempo_actual)) != Math.trunc(localStorage.getItem(clave_duracion_video))){
		location.replace("http://192.168.100.21/play");
	}
	if (localStorage.getItem(clave_lista_videos)){
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
			}
		}else{	
				localStorage.setItem(clave_cont, cont);
				location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
		}

		localStorage.setItem(clave_cont, cont);
		location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
	}else {
		location.replace("http://192.168.100.21/play");
	};
});





/*
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
*/
