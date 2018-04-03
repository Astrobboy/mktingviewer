const jsonlint = require("jsonlint");
const axios = require("axios");
const shell = require('shelljs');


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url_db = 'mongodb://localhost:27017';
// Database Name
const dbName = 'atacado_producto';

//const que va a probar si el array se modifico o no
const valor_prueba = true;
const result = '';

const URL = "http://www2.atacadogames.com/app/produtos.json";


MongoClient.connect(url_db, function (err, client) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	const db = client.db(dbName);
	const collection = db.collection('producto');
	//busco todos los datos de db
	collection.find({}).toArray(function (err, result) {
		if (err) throw err;
		result = result;
		//si todo okey hago la peticion del json
		axios.get(URL).then(response => {
			var json = jsonlint.parse(JSON.stringify(response.data));
			if (json) {
				//obtengo codigo de los objeto 
				var codigo = Object.keys(json);

				//comparo los valores de json pag y json db codigo.length
				for (var i = 0; i < codigo.length; i++) {

					//guarda en valor el objeto de la clave en ese momento
					var valor = Object.keys(json[codigo[i]]);
					//obtengo en otro objeto el valor del objeto anterior
					var values_object = json[codigo[i]];
					//compruebo el array de db con el de pag
					if (values_object.link_images.length != result[i].link_images.length) {
						valor_prueba = false;
						console.log('aqui');
					}

					if (values_object.title == result[i].title &&
						values_object.description == result[i].description &&
						valor_prueba) {
						console.log('no hubo cambios');
						client.close();
						for (var y = 0; y < values_object[valor[2]].length; y++) {
							// cambiar a esta ruta
							// /home/astro/mktingviewer/static/img/productos/
							shell.exec(`../checkfile.sh ${values_object[valor[2]][y]}`)
							console.log('termine');
						}
					}

				}
				//console.log(valor_prueba);

				// si son distintos va a borrar los datos e insertar de nuevo
				if (valor_prueba != true) {
					//console.log(result);
					collection.remove({}).then(() => {
						//for par agrupar los datos
						for (var i = 0; i < codigo.length; i++) {
							//guarda en valor el objeto de la clave en ese momento
							var valor = Object.keys(json[codigo[i]]);
							//obtengo en otro objeto el valor del objeto anterior
							var values_object = json[codigo[i]];
							// Insert some producto
							collection.insertMany([
								{
									codigo: codigo[i],
									title: values_object[valor[0]],
									description: values_object[valor[1]],
									link_images: values_object[valor[2]],
									price: values_object[valor[3]],
									stock: values_object[valor[4]]
								}

							]);
							for (var y = 0; y < values_object[valor[2]].length; y++) {
								shell.exec(`../checkfile.sh ${values_object[valor[2]][y]}`);
							}
						}
						console.log("Sali!");
						client.close();
					}).catch(e => console.log(e));
				}
			}
		}).catch(e => console.log(e));
	});

});

