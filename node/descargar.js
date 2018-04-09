const jsonlint = require("jsonlint");
const axios = require("axios");
const shell = require('shelljs');


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url_db = 'mongodb://localhost:27017';
// Database Name
const dbName = 'atacado_producto';

var result = '';



MongoClient.connect(url_db, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection('producto');
    //busco todos los datos de db
    collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        result = result;
        var codigo = Object.keys(result);

        //comparo los valores de result pag y result db codigo.length
        for (var i = 0; i < codigo.length ; i++) {

            //guarda en valor el objeto de la clave en ese momento
            var valor = Object.keys(result[codigo[i]]);
            //obtengo en otro objeto el valor del objeto anterior
            var values_object = result[codigo[i]];
            //console.log(values_object);
            //compruebo el array de db con el de pag
            for (var y = 0; y < values_object[valor[4]].length; y++) {
                // cambiar a esta ruta
                // /home/astro/mktingviewer/static/img/productos/
                console.log(values_object[valor[4]][y]);
                shell.exec(`../checkfile.sh ${values_object[valor[4]][y]}`)
               // console.log('termine');
            }
        }
        client.close();
    })
});
