var clave = 'lista_videos';
var video = document.getElementById("demo");
var mostrar = localStorage.getItem(clave),
separador = ",",
nom_videos = mostrar.split(separador);
var cont = 0,
	clave_cont = 'cont';


video.addEventListener("ended", function() {
	if (localStorage.getItem(clave)){
		if(localStorage.getItem(clave_cont)){
			cont = Math.trunc(localStorage.getItem('cont'));
			if(cont == (nom_videos.length)-1){
				cont = 0;
				localStorage.setItem(clave, cont);
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