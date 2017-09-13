"use strict";

const app = {
    map: undefined,

    init: function() {
        app.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: { lat: -16.3988900, lng: -71.5350000 },
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false
        });

        let partida = document.getElementById('origen');
        let autoPartida = new google.maps.places.Autocomplete(partida);
        autoPartida.bindTo('bounds', app.map);
        let detalleUbicacionOrigen = new google.maps.InfoWindow();
        let marcadorPartida = app.crearMarcador(app.map);

        app.crearListener(autoPartida, detalleUbicacionOrigen, marcadorPartida);

        let llegada = document.getElementById('destino');
        let autoLlegada = new google.maps.places.Autocomplete(llegada);
        autoLlegada.bindTo('bounds', app.map);
        let detalleUbicacionDestino = new google.maps.InfoWindow();
        let marcadorLlegada = app.crearMarcador(app.map);

        app.crearListener(autoLlegada, detalleUbicacionDestino, marcadorLlegada);

        // Mi ubicación actual 
        document.getElementById("encuentrame").addEventListener("click", app.buscarUbicacion);
        // Ruta 
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;

        document.getElementById("ruta").addEventListener("click", function() { app.dibujarRuta(directionsService, directionsDisplay) });

        directionsDisplay.setMap(app.map);
    },
    crearListener: function(autocomplete, detalleUbicacion, marker) {
        autocomplete.addListener('place_changed', function() {
            detalleUbicacion.close();
            marker.setVisible(false);
            let place = autocomplete.getPlace();
            app.marcarUbicacion(place, detalleUbicacion, marker);
        });
    },

    buscarUbicacion: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(app.marcarUbicacionAutomatica, app.funcionError);
        }
    },

    funcionError: function(error) {
        alert("Tenemos un problema para encontrar tu ubicación");
    },

    marcarUbicacionAutomatica: function(posicion) {
        let latitud = posicion.coords.latitude;
        let longitud = posicion.coords.longitude;

        let miUbicacion = new google.maps.Marker({
            position: { lat: latitud, lng: longitud },
            animation: google.maps.Animation.DROP,
            map: app.map
        });
        app.map.setZoom(17);
        app.map.setCenter(miUbicacion.position);
    },

    marcarUbicacion: function(place, detalleUbicacion, marker) {
        if (!place.geometry) {
            // Error si no encuentra el lugar indicado
            window.alert("No encontramos el lugar que indicaste: '" + place.name + "'");
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            app.map.fitBounds(place.geometry.viewport);
        } else {
            app.map.setCenter(place.geometry.location);
            app.map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        let address = '';
        if (place.referenciaDirecion) {
            address = [
                (place.referenciaDirecion[0] && place.referenciaDirecion[0].short_name || ''),
                (place.referenciaDirecion[1] && place.referenciaDirecion[1].short_name || ''),
                (place.referenciaDirecion[2] && place.referenciaDirecion[2].short_name || '')
            ].join(' ');
        }

        detalleUbicacion.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        detalleUbicacion.open(map, marker);
    },

    crearMarcador: function(map) {
        let icono = {
            url: 'http://icons.iconarchive.com/icons/sonya/swarm/128/Bike-icon.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };

        let marker = new google.maps.Marker({
            map: app.map,
            animation: google.maps.Animation.DROP,
            icon: icono,
            anchorPoint: new google.maps.Point(0, -29)
        });

        return marker;
    },

    dibujarRuta: function(directionsService, directionsDisplay) {
        let origin = document.getElementById("origen").value;
        let destination = document.getElementById('destino').value;

        if (destination != "" && destination != "") {
            directionsService.route({
                    origin: origin,
                    destination: destination,
                    travelMode: "DRIVING"
                },
                function(response, status) {
                    if (status === "OK") {
                        directionsDisplay.setDirections(response);
                    } else {
                        funcionErrorRuta();
                    }
                });
        }
    },

    funcionErrorRuta: function() {
        alert("No ingresaste un origen y un destino validos");
    }
}



function initMap() {
    app.init();
}

/*Guardar datos*/

function guardarTel(){
    var codigo = Math.floor(Math.random()*900)+100;
    if(document.getElementById("telefono").value.length == 9){
        localStorage.telefono = document.getElementById("telefono").value;
        localStorage.codigo = codigo;
        alert("Codigo de Usuario :  "+codigo);
           /* swal({
                title: codigo,
                text: "Codigo de Usuario",
                timer: 2000,
                showConfirmButton: false,
            });*/
        }
}

function guardarDatos(){
    localStorage.nombre = document.getElementById("nombre").value;
    localStorage.email = document.getElementById("email").value;

}