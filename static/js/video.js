var clave = 'lista_videos',
	clave_cont = 'cont',
	cont = Math.trunc(localStorage.getItem('cont')),
	actual_t = 0,
	clave_actual_t = 'tiempo_actual';
var video = document.getElementById("demo");


if (typeof(localStorage.getItem(clave)) == "string" && localStorage.getItem(clave).indexOf(',') == -1 ){
	var nom_videos = new Array();
	nom_videos.push(localStorage.getItem(clave));
}else{
	var mostrar = localStorage.getItem(clave),
	separador = ",",
	nom_videos = mostrar.split(separador);
}

function duracion(){
	actual_t = video.currentTime;
	localStorage.setItem(clave_actual_t, actual_t);
	localStorage.getItem('holasoyduracion', 'quedeguardado');
}

window.onbeforeunload = function (event) {
		duracion();
}


function verifica(){
	console.log('hola');
	if (localStorage.getItem(clave_actual_t, actual_t)){
		actual_t = Math.trunc(localStorage.getItem(clave_actual_t, actual_t));
		video.currentTime = actual_t;
	}else{
		console.log('hola');
	}
}

window.load = function () {
	verifica();
}

video.addEventListener("ended", function() {
	actual_t = 0;
	if (localStorage.getItem(clave)){
		if(localStorage.getItem(clave_cont)){
			cont = Math.trunc(localStorage.getItem('cont'));
			if(cont == (nom_videos.length)-1){
				cont = 0;
				localStorage.setItem(clave_cont, cont);
				location.replace("http://127.0.0.1:5000/video/"+nom_videos[cont]);
			}else{
				cont += 1;
				localStorage.setItem(clave_cont, cont);
				location.replace("http://127.0.0.1:5000/video/"+nom_videos[cont]);	
			};
		}else {
			localStorage.setItem(clave_cont, cont);
			location.replace("http://127.0.0.1:5000/video/"+nom_videos[cont]);
		}

		localStorage.setItem(clave_cont, cont);
		location.replace("http://127.0.0.1:5000/video/"+nom_videos[cont]);
	}else {
		location.replace("http://127.0.0.1:5000/selecciona");
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
