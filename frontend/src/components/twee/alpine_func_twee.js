/**
 * Global
 *
 */

'use strict';

window.csvParser = () => {
  return {
    tempArr: [],
    tempCar: [],

    map01: new L.map('map01', {
      // dragging: !L.Browser.mobile,
      // tap: !L.Browser.mobile,
      // zoomControl: true,
      // renderer: L.canvas()
      // // preferCanvas: true
    }),

    fg_car: new L.FeatureGroup(),
    fg_bike: new L.FeatureGroup(),
    fg_walk: new L.FeatureGroup(),

    init() {
      this.init_map();
    },

    toggleDisableUpload() {
      document.getElementById('btn-upload').disabled = false;
    },

    init_map() {
      const mapbox_token =
        "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
      const mbAttr =
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>";

      // create default title layer
      const mapbox_gray = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=' + mapbox_token, {
        attribution: mbAttr,
        tileSize: 512,
        zoomOffset: -1
      });

      const mapbox_color = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + mapbox_token, {
        attribution: mbAttr,
        tileSize: 512,
        zoomOffset: -1
      });

      // create base layers
      const base_layers = {
        "<span style=''>Kleur</span>": mapbox_color,
        "<span style=''>Grijs</span>": mapbox_gray,
      };

      // add default overlay to object
      const lcontrol = new L.control.layers(base_layers, true, {
        collapsed: true,
        sortLayers: true,
        hideSingleBase: true
      });

      // general map settings
      this.map01.setView([52.37, 4.91]);
      this.map01.setZoom(13);

      // restricting map view
      // this.map01.setMinZoom(7);
      // map01.setMaxBounds(bounds);

      //
      this.map01.addLayer(mapbox_gray);
      this.map01.addControl(lcontrol);

      //
      // this.addLeafletControlCustom();

      // add FeatureGroup TLC to map
      /* lcontrol.addOverlay(this.fg_tlc, "VRI telpunten"); */
      /* this.map01.addLayer(this.fg_tlc); */

      // add FeatureGroup NDW to map
      lcontrol.addOverlay(this.fg_car, "Motorvoertuigen");
      lcontrol.addOverlay(this.fg_bike, "Fietsers");
      lcontrol.addOverlay(this.fg_walk, "Voetgangers");

      this.map01.addLayer(this.fg_car);
      this.map01.addLayer(this.fg_bike);
      this.map01.addLayer(this.fg_walk);
    },

    submit() {
      Papa.parse(document.getElementById('csvFile').files[0], {
        header: true,
        delimeter: ",",
        newline: "\n",
        skipEmptyLines: true,
        complete: results => {
          const arrToBeFiltered = results.data,
            filtered = arrToBeFiltered.filter((a) => {
              const key = a.longitude + '|' + a.latitude + '|' + a.modaliteit;
              if (!this[key]) {
                this[key] = true;
                return true;
              }
            }, Object.create(null));
          this.tempArr = filtered;

          // create and add longitude, latitude and modaliteit to new geoArray
          const geoArr = [];

          filtered.map(filterRow => {
            if (filterRow.longitude != "" && filterRow.latitude != "" && filterRow.modaliteit != "") {
              lonlat = { longitude: filterRow.longitude, latitude: filterRow.latitude, modaliteit: filterRow.modaliteit };
              geoArr.push(lonlat);
              const button = document.getElementById('confirmation-btn');
              button.disabled = false;

            } else {
              document.getElementById("incorrect-csv").classList.remove('hidden');
            }
          }); // End filtered.map()

          // map the geoArr to create the correct markers based on modaliteit
          geoArr.map(geoArrRow => {
            const coordinates = [geoArrRow.longitude, geoArrRow.latitude];
            const modaliteit = geoArrRow.modaliteit;


            if (modaliteit === 'fiets') {
              const lonlatToAdd = L.circleMarker(coordinates, {
                color: 'gray',
                fillColor: 'gray',
                fillOpacity: 0.5,
                radius: 50
              }).bindPopup('Telpunt: ' + modaliteit);
              const lg_bike = L.layerGroup([lonlatToAdd]).addTo(mymap);
            }
            if (modaliteit === 'auto') {
              const lonlatToAdd = L.circleMarker(coordinates, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5,
                radius: 50
              }).bindPopup('Telpunt: ' + modaliteit);
              const lg_car = L.layerGroup([lonlatToAdd]).addTo(mymap);
            }
            if (modaliteit === 'voetganger') {
              const lonlatToAdd = L.circle(coordinates, {
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.5,
                radius: 50
              }).bindPopup('Telpunt: ' + modaliteit);
              const lg_walk = L.layerGroup([lonlatToAdd]).addTo(mymap);

            }
          }); // End geoArr.map()
        } // End complete: property
      }); // End papa.parse

    } // End submit()
  } // End return
};
