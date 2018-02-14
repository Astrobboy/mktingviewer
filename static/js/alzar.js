console.log("hola1");
function handleFileSelect(evt){
	//objeto FileList
	console.log("hola");
	var files = evt.files = evt.target.files;
	var reader = new FileReader();
	

	//console.log(files);
	//file es una lista de FileList de File object
	var salida = [];
	for(var i = 0, f; f= files[i]; i++){
		//console.log(reader.readAsDataURL(f.type));
		console.log(f);
		salida.push('<td>'+
						'<span class="preview"><video src="{{ ruta }}{{ video }}" controls=""></video></span>'+
					'</td>'+
					'<td>'+
						'<p class="name">'+ f.name+' </p>'+
					'</td>'+
					'<td>'+
						'<p class="size">'+f.size+'</p>'+
						'<p class="size">'+ f.type || 'n/a'+ '</p> '+
						'<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">'+
							'<div class="progress-bar progress-bar-success" style="width:0%;">'+
					
							'</div>'+
						'</div>'+
					'</td>'+
						'<td>'+
						'<button class="btn btn-primary start" disabled="">'+
						'<i class="glyphicon glyphicon-upload"></i>'+
						'<span>Start</span></button>'+
						'<button class="btn btn-warning cancel">'+
						'<i class="glyphicon glyphicon-ban-circle"></i>'+
						'<span>Cancel</span>'+
						'</button></td>'+
						'<br><p>bytes last modified: '+ f.lastModifiedDate.toLocaleDateString()+
						'</p>' );
	}
	//console.log(salida);

	document.getElementById('list').innerHTML = '<tr class="template-upload fade in">' + salida + '</tr>';
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);

//aca
/*

function previewFile() {
  var preview = document.querySelector('video');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
    console.log(reader.result);
    preview.src = reader.result;
  }

  if (file) {
    console.log(reader.readAsDataURL(file));
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}


*/


/*
console.log("hola1");

function handleFileSelect(evt){
	//objeto FileList
	console.log("hola");
	var files = evt.files = evt.target.files;
	//file es una lista de FileList de File object
	var salida = [];
	for(var i = 0, f; f= files[i]; i++){
		salida.push('<li><strong>', escape(f.name),'</strong> (', f.type || 'n/a', ') - ', f.size, 
			'bytes, last modified: ', f.lastModifiedDate.toLocaleDateString(),'</li>' );
	}

	document.getElementById('list').innerHTML = '<ul>' + salida.join('')+'</ul>';
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);
*/








	
/*
var cont = 1;
var tiempo = 0;
function ejecutar(){
	setTimeout(function(){
        ejecutar();
    }, tiempo)
    
	tiempo += 1000; 
	var num = [0,1,2];
	var video = document.getElementById("demo");
	//obtiene la duracion
	//Math.trunc(video.duration)
	//obtiene el tiempo del momento
    //video.currentTime
    console.log(cont);
    if (Math.trunc(video.currentTime) == Math.trunc(video.duration)){
    	console.log("aqui deberia cambiar");    		
 		location.replace("http://127.0.0.1:5000/test/"+cont);
 		cont += 1;
 		console.log(cont);
    }else if (cont == 2){
    	cont = 0;
    };
   

}*/

/*


window.onload = function() {
 	//var  i = setInterval(termino, 500);
 	ejecutar();
}


var tiempo = 0;

function ejecutar(){
    setTimeout(function(){
        ejecutar();
    }, tiempo)

    tiempo += 1000;
    
    $("#mensaje").append('<p>Me ejecuté a los ' + tiempo + ' milisegundos</p>');
}






function vamos(){
	var num = [0,1,2],
	cont = 0;
	
    while(cont <= num.length){

    	console.log(cont+" cont dentro while y  num[cont] = " + num[cont]);
	    video.addEventListener("ended", function() {

	    	if (cont == num.length){
	    		cont = 0;
	    	}else{	
	    		console.log("aqui deberia cambiar");    		
				location.replace("http://127.0.0.1:5000/test/"+num[cont]);
	    	};
	    		
		});
		
	};
*/

