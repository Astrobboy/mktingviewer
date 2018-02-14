var clave = 'lista_videos',
	clave_cont = 'cont',
	cont = Math.trunc(localStorage.getItem('cont')),
	actual_t = 0,
	clave_actual_t = 'tiempo_actual';
var video = document.getElementById("demo");
var mostrar = document.getElementById('lista_videos').innerHTML;

if (typeof(localStorage.getItem(clave)) == "string" && localStorage.getItem(clave).indexOf(',') == -1 ){
	var nom_videos = new Array();
	nom_videos.push(localStorage.getItem(clave));
}else{
	if (localStorage.getItem(clave)){
	    mostrar = localStorage.getItem(clave);
	}else{
	   if (mostrar){
               localStorage.setItem(clave, mostrar);
	   }else{
	      location.replace("http://192.168.100.21:8000/selecciona");	
 	   }
	}
	 var separador = ",",
         nom_videos = mostrar.split(separador);
}


video.addEventListener("ended", function() {
	if (localStorage.getItem(clave)){
		if(localStorage.getItem(clave_cont)){
			cont = Math.trunc(localStorage.getItem('cont'));
			if(cont == (nom_videos.length)-1){
				cont = 0;
				localStorage.setItem(clave_cont, cont);
				location.replace("http://192.168.100.21:8000/video/"+nom_videos[cont]);
			}else{
				cont += 1;
				localStorage.setItem(clave_cont, cont);
				location.replace("http://192.168.100.21:8000/video/"+nom_videos[cont]);	
			};
		}else {
			localStorage.setItem(clave_cont, cont);
			location.replace("http://192.168.100.21:8000/video/"+nom_videos[cont]);
		}

		localStorage.setItem(clave_cont, cont);
		location.replace("http://192.168.100.21:8000/video/"+nom_videos[cont]);
	}else {
		location.replace("http://192.168.100.21:8000/selecciona");
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
