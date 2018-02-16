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
//var mostrar = document.getElementById('lista_videos').innerHTML;


var socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on("lista", (data) => {
	if (localStorage.getItem(clave_lista_videos)){
		console.log("ya tengo una lista");
	}else {
		localStorage.setItem(clave_lista_videos, data);
	    console.log("recibi los datos");	
	}
});


localStorage.setItem(clave_duracion_video ,video.duration);


function verifica(){
	tiempo_actual = localStorage.getItem(clave_tiempo_actual)
	console.log("soy tiempo actual "+tiempo_actual);
	/*if (tiempo_actual == 0){
		 console.log("soy actual time "+tiempo_actual);
	}else{
		video.currentTime = tiempo_actual;
		console.log("soy tiempo actual antes de guardarme a 0 "+tiempo_actual);   
		localStorage.setItem(clave_tiempo_actual, '0');
	}*/
}


function duracion(){
	tiempo_actual = video.currentTime;
	localStorage.setItem(clave_tiempo_actual, tiempo_actual);
	localStorage.setItem(url_clave, url_location);
	localStorage.setItem('loguarde', tiempo_actual);
}

window.onbeforeunload = function (event) {
		duracion();
}


video.addEventListener("ended", function() {
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
			/*if(Math.trunc(localStorage.getItem('loguarde')) != Math.trunc(video.duration)){
				location.replace("http://192.168.100.21/play");
			}else{*/
				localStorage.setItem(clave_cont, cont);
				location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
			//}
		}

		localStorage.setItem(clave_cont, cont);
		location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
	}else {
		location.replace("http://192.168.100.21/play");
	};
});











/*	
console.log(localStorage.getItem(url_clave));
if (localStorage.getItem(url_clave) == 'http://192.168.100.21/play' &&  Math.trunc(localStorage.getItem(clave_tiempo_actual) == 0)){
	console.log('sigo mi curso normal');
	console.log(Math.trunc(localStorage.getItem(clave_tiempo_actual)));	
}else{
	if (localStorage.getItem(url_clave)){
		location.replace(localStorage.getItem(url_clave));
	}else{
		location.replace("http://192.168.100.21/selecciona");
	}
}	

*/
/*
if (localStorage.getItem(url_clave) == 'http://192.168.100.21/play' &&  Math.trunc(localStorage.getItem(clave_tiempo_actual) == 0)){
	console.log('sigo mi curso normal');
	console.log(Math.trunc(localStorage.getItem(clave_tiempo_actual)));	
}else{
	if (typeof(localStorage.getItem(clave_lista_videos)) == "string" && localStorage.getItem(clave_lista_videos).indexOf(',') == -1 ){
		var nom_videos = new Array();
		nom_videos.push(localStorage.getItem(clave_lista_videos));
	}else{
		if (localStorage.getItem(clave_lista_videos)){
		    mostrar = localStorage.getItem(clave_lista_videos);
		}else{
			if (mostrar){
	        	localStorage.setItem(clave_lista_videos, mostrar);
		    	localStorage.getItem(clave_lista_videos);
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
		console.log('soy nom_videos '+nom_videos);
	}
}	
*/











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
