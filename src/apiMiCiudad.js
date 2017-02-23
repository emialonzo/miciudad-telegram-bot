var rp = require('request-promise');
const Drupal = require('drupal-services-api/index')
 const endpoint = 'https://www.miciudad.org.py/api/v1';

 function createClient(){
  var client = new Drupal(endpoint);
  return client;
};


 function login(user, password){
  var client = new Drupal(endpoint);

  client.login(user, password).then(function(algo) {
    console.log("drupal._cookie:" + client._cookie + " | drupal._csrfToken:" + client._csrfToken);
    console.log("Algo:"+JSON.stringify(algo));
    crearEvento(client);
  });
}


// export function login(user, password){
//   var client = new Drupal(endpoint);
//
//   client.login(user, password).then(function(algo) {
//     console.log("drupal._cookie:" + client._cookie + " | drupal._csrfToken:" + client._csrfToken);
//     console.log("algo"+JSON.stringify(algo));
//     crearEvento(client);
//   });
// }

function crearEvento(client){
  client.create({
  type: 'evento',
  title: 'Fiesta en el Pasado',
  "field_hashtags": {
        "und": [
            {
                "tid": "12"
            }
        ]
    },
    "body": {
        "und": [
            {
                "value": "<p>Descripcion de prueba2</p>\r\n",
                "summary": "",
                "format": "formato_enriquecido",
                "safe_value": "<p>Descripcion de prueba</p>\n",
                "safe_summary": ""
            }
        ]
    },
    "field_geo_ubicacion": {
        "und": [
            {
                "geom": "POINT (-57.634878158569 -25.28303170037)",
                "geo_type": "point",
                "lat": "-25.283031700370",
                "lon": "-57.634878158569",
                "left": "-57.634878158569",
                "top": "-25.283031700370",
                "right": "-57.634878158569",
                "bottom": "-25.283031700370",
                "geohash": "6ex00mredj21200h"
            }
        ]
    },
    "field_fecha_y_hora": {
        "und": [
            {
                "value": {
                  "date": "02/01/2016",
                  "time": "12:00"
                },
                "value2":  {
                  "date": "02/01/2016",
                  "time": "15:00"
                 }
            }
        ]
    }
}).then(function(newArticle) {
  console.log("Articulo creado");
  console.log(JSON.stringify(newArticle));
}).error(err => {console.error('Error!!!'+err)});
}

module.exports = {
      crearEvento: crearEvento,
      login: login,
      createClient: createClient,
      endpoint: endpoint,
      Drupal: Drupal,
  };
