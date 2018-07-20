var video = document.getElementById("demo");
let cont;

function verificar(tiempo, contador) {
    cont = contador;
    if (tiempo == 'false') {
        //paso
    } else {
        video.currentTime = tiempo;
    }
}

window.onbeforeunload = function(event) {
    tiempo_actual = duracion();
    if (video.currentTime == video.duration) {
        cont += 1;
    }
    envio_json(cont, tiempo_actual);
}

//funcion que esta a la escucha de cuando termine el video
video.addEventListener("ended", function() {
    location.reload();
});


function envio_json(cont, tiempo) {
    $.ajax({
        type: "POST",
        url: "http://10.10.10.34:5000/datos",
        data: JSON.stringify({
            "cont": cont,
            "tiempo": tiempo
        }),
        contentType: 'application/json'
    });

}


function duracion() {
    //comprueba si son iguales el tiempo actual y el tiempo en que finalisa
    if (video.currentTime == video.duration) {
        //si son iguales 0
        return 0;
    } else {
        // si son distintos retorna la duracion en ese momento
        return video.currentTime;
    }
}

//var token = document.getElementById('token').value
/*json_data = {
		"cont": cont,
		"tiempo":  tiempo
		} 
socket.emit('datos', json_data); //envio a datos
console.log(json_data);*/
//setTimeout(() => {
//socket.disconnect();
//}, 500);
//var socket = io.connect('http://' + document.domain + ':' + location.port, {transports: ['websocket']}, {"token": token});