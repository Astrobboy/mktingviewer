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


//var socket = io.connect('http://' + document.domain + ':' + location.port);


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

function obtener_json(){
	if (video.currentTime >= (video.duration - 10)){
		var xhr = new XMLHttpRequest();
		xhr.open("GET","http://192.168.100.21/doy_json");
		xhr.send();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200){
				if (localStorage.getItem(clave_lista_videos)){
					var nuevo_array = JSON.parse(xhr.responseText);
					var actual_array = JSON.parse(localStorage.getItem(clave_lista_videos));
					//ordeno las listas
					nuevo_array.sort();
					actual_array.sort();
					if(nuevo_array.length==actual_array.length && nuevo_array.every(function(v,i) { return v === actual_array[i] } )){
						//si es cierto no hace nada
						console.log("no hubo cambios");
					}else{	
						//si hubo cambios guarda la lista y contador vuelve a cero
						console.log("si hubo cambios");
						localStorage.setItem(clave_lista_videos, xhr.responseText);
						localStorage.setItem(clave_cont, '0')
					}
				}else{
					localStorage.setItem(clave_lista_videos, xhr.responseText);
				}
			}
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
setInterval('obtener_json()',1000);

//si es igual a play limpia el localStorage
if(window.location == 'http://192.168.100.21/play'){
	localStorage.clear();
}



//funcion que esta a la escucha de cuando termine el video
video.addEventListener("ended", function() {
	//devuelve el tiempo actual a cero
	localStorage.setItem(clave_tiempo_actual, '0');
	//obtiene la lista
	nom_videos = JSON.parse((localStorage.getItem(clave_lista_videos)));

	/*if(Math.trunc(localStorage.getItem(clave_tiempo_actual)) != Math.trunc(localStorage.getItem(clave_duracion_video))){
		location.replace("http://192.168.100.21/play");
	}*/
	
	
		//valida si existe una lista, si no vuelve a play
		if (localStorage.getItem(clave_lista_videos)){
			//valida si hay un contador, si no guarda el contador = 0 y comienza el video en 0
			if(localStorage.getItem(clave_cont)){
				//si existe trae el contador
				cont = Math.trunc(localStorage.getItem('cont'));
				//pregunta si el contador es igual a la longitud de la lista
				if(cont == (nom_videos.length)-1){
					//si es devuelve a 0 cont y vuelve a empezar de 0
					cont = 0;
					localStorage.setItem(clave_cont, cont);
					location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
				}else{
					//si es falso le suma uno hasta que llegue a ser igual a la longitud de la lista
					cont += 1;
					localStorage.setItem(clave_cont, cont);
					location.replace("http://192.168.100.21/video/"+nom_videos[cont]);	
				}
			}else{	
					localStorage.setItem(clave_cont, '0');
					location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
			}

			localStorage.setItem(clave_cont, cont);
			location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
		}
	
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
