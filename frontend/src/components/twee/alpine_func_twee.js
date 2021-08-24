/**
 * Global
 *
 */

'use strict';

window.csvParser = () => {
  return {
    tempArr: [],
    tempCar: [],
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
