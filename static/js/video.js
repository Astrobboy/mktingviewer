var clave_lista_videos = 'lista_videos',
	clave_cont = 'cont',
	cont = Math.trunc(localStorage.getItem('cont')),
	tiempo_actual = 0,
	clave_tiempo_actual = 'tiempo_actual',
	duracion_video = 0,
	clave_duracion_video = 'termina_en';
var url_location = window.location;
var url_clave = 'url';
localStorage.setItem(url_clave, url_location);



var video = document.getElementById("demo");
var mostrar = document.getElementById('lista_videos').innerHTML;




console.log("Fuera del if soy tiempo actual");	
console.log(Math.trunc(localStorage.getItem(clave_tiempo_actual)));	


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


function duracion(){
	tiempo_actual = video.currentTime;
	localStorage.setItem(clave_tiempo_actual, tiempo_actual);
	var url_location = window.location;
	var url_clave = 'url';
	localStorage.setItem(url_clave, url_location);
	localStorage.setItem('loguarde', tiempo_actual);
}

window.onbeforeunload = function (event) {
		duracion();
}

function verifica(){
	localStorage.setItem(clave_duracion_video ,Math.trunc(video.duration));
	tiempo_actual = Math.trunc(localStorage.getItem(clave_tiempo_actual));
	if (tiempo_actual != 0){
		console.log("soy actualt dentro de veri "+tiempo_actual);
		video.currentTime = tiempo_actual;
		localStorage.setItem(clave_tiempo_actual, '0');
		console.log("soy tiempo actual dentro de verifica "+tiempo_actual);
	}else{
	    
	    console.log("soy actual time en el else "+tiempo_actual);
	}
}



video.addEventListener("ended", function() {
	console.log("soy tiempo actual "+Math.trunc(localStorage.getItem(clave_tiempo_actual)));
	console.log("Soy duracion del video "+Math.trunc(localStorage.getItem(clave_duracion_video)));
	if(Math.trunc(localStorage.getItem(clave_tiempo_actual)) != Math.trunc(localStorage.getItem(clave_duracion_video))){
		location.replace("http://192.168.100.21/play");
	}
	var termino = video.currentTime;
	localStorage.setItem(clave_tiempo_actual, termino);
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
			if(Math.trunc(localStorage.getItem('loguarde')) != Math.trunc(video.duration)){
				location.replace("http://192.168.100.21/play");
			}else{
				localStorage.setItem(clave_cont, cont);
				location.replace("http://192.168.100.21/video/"+nom_videos[cont]);
			}
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
