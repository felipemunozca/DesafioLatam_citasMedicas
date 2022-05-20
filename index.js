const http = require('http');
const url = require('url');
const axios = require('axios');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');
const {v4: uuidv4} = require('uuid');

let historial_citas = [];

http.createServer((req, res) => {

    if (req.url.startsWith('/consultar')) {

        let urlAPI = 'https://randomuser.me/api';

        axios.get(urlAPI)
        .then(response => {

            res.writeHead(200, {'content-type': 'text/html; charset=utf8'});

            let objeto = {
                nombre: response.data.results[0].name.first,
                apellido: response.data.results[0].name.last,
                id: uuidv4().slice(30),
                fecha_registro: moment().format('MMM Do YYYY, h:mm:ss a')
            }

            historial_citas.push(objeto);

            res.write('<p>HISTORIAL DE CONSULTAS</p>');

            _.forEach(historial_citas, (elemento, indice) => {

                res.write(`<p> ${indice + 1}. Nombre: ${elemento.nombre} - Apellido: ${elemento.apellido} - ID: ${elemento.id} - Timestamp: ${elemento.fecha_registro}</p>`);

                console.log(chalk.blue.bgWhite(`${indice + 1}. Nombre: ${elemento.nombre} - Apellido: ${elemento.apellido} - ID: ${elemento.id} - Timestamp: ${elemento.fecha_registro}`));

            })

            res.end();
        })
        .catch(error => {
            res.writeHead(500, {'content-type': 'text/html; charset=utf8'});
            res.write('<p>Ha ocurrido un error interno en el servidor.</p>');
            console.log('Error al consultar la API');
            res.end();
        })

    }

}).listen(3000, () => {
    console.log('Servidor levantado en http://localhost:3000');
})

/* para ejecutar el programa, se debe escribir el siguiente comando en la terminal */
/* npm nodemon index.js */
/* en el navegador, abrir la url localhost + el puerto + el endpoint "consultar" */
/* http://localhost:3000/consultar */