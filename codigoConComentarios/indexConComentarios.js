/* paquetes a utilizar para el desarrollo del desafio. */
const http = require('http');
const url = require('url');
const axios = require('axios');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');
const {v4: uuidv4} = require('uuid');

/* arreglo vacio en donde se iran agregando los datos de cada consulta.  */
let historial_citas = [];

/* se crea el servidor, y se le deben pasar dos valores; un request (peticion) y un response (respuesta) como parametros. */
http.createServer((req, res) => {

    /* startWith(), es un metodo que indica que la ruta comienza comienza con la palabra o ENDPOINT que decida utilizar. */
    if (req.url.startsWith('/consultar')) {

        /* API a utilizar del desafio. */
        let urlAPI = 'https://randomuser.me/api';

        /* AXIOS se utiliza mas un verbo en ingles, en este caso: get 
        ademas, le paso la url de la API, y al ser una promesa, debo utilizar .then() y .catch() */
        axios.get(urlAPI)
        .then(response => {

            /* si la respuesta es exitosa, le envio por el encabezado un codigo 200 que indica que esta todo ok. */
            /* ademas, le digo que utilizare un formato de html para crear una respuesta visible en el navegador. */
            res.writeHead(200, {'content-type': 'text/html; charset=utf8'});

            /* creo un nuevo objeto al le paso las respuestas de la api para despues llamar cada variable de forma mas organica. */
            let objeto = {
                nombre: response.data.results[0].name.first,
                apellido: response.data.results[0].name.last,
                /* utilizo UUID para generar un id automatico, como tiene un largo de 36 digitos, limito la respuesta desde el
                caracter 30 en adelante. para que solo se guarden los ultimos 6. */
                id: uuidv4().slice(30),
                /* utilizo MOMENT para crear el formato de fecha que pide el desafio. La fecha se imprimira en Ingles. */
                fecha_registro: moment().format('MMM Do YYYY, h:mm:ss a')
            }

            /* cada vez que se haga una consulta, se subira ese valor en el arreglo vacio que declare al principio. */
            historial_citas.push(objeto);

            /* utilizo LODASH con el guion bajo junto al metodo forEach para recorrer el arreglo e imprimir las respuestas en el navegador. */
            res.write('<p>HISTORIAL DE CONSULTAS</p>');

            _.forEach(historial_citas, (elemento, indice) => {

                res.write(`<p> ${indice + 1}. Nombre: ${elemento.nombre} - Apellido: ${elemento.apellido} - ID: ${elemento.id} - Timestamp: ${elemento.fecha_registro}</p>`);

                /* utilizo CHALK para primero darle el color azul al texto de consola, y luego el fondo de color blanco para cada linea.  */
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