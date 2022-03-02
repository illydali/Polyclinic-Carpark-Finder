let singapore = [1.36, 103.85];
let map = L.map("main-map").setView(singapore, 14);

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "sk.eyJ1IjoiNmlsbHkiLCJhIjoiY2t6dGoxaHJlMGNzZzJvbnduZGdic2lvbyJ9.8s5meHPYaHhf-IOxa03MxA"
}).addTo(map);

proj4.defs("EPSG:3414", "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");


// setting up icons
let polyIcon = L.icon({
    iconUrl: '/icons/poly-blood.svg',
    iconSize: [30, 30],
    popupAnchor: [-3, -76]
});

let parkingIcon = L.icon({
    iconUrl: '/icons/parking-pin.svg',
    iconSize: [30, 30],
    popupAnchor: [-3, -76]
})

// setting up layers
let polyLayer = L.markerClusterGroup();
let parkingGroup = L.markerClusterGroup();
let polyMarker = L.marker;
let baseLayer = L.layerGroup();
let searchResult = L.layerGroup()
searchResult.addTo(map);

let carparkInfo = [];
let polyInfo = [];

window.addEventListener("DOMContentLoaded", async function () {
    baseLayer.clearLayers();
    let location = await locationData();

    for (let eachPoly of location) {
        let polyCoordinates = [eachPoly.geocodes.main.latitude, eachPoly.geocodes.main.longitude];
        polyMarker = L.marker(polyCoordinates, { icon: polyIcon });
        polyMarker.bindPopup(`
        <div class="card bg-light border-0 m-0 p-0" style="width: 10rem">
        <div class="card-body h-100">
            <p class="card-title h6">${eachPoly.name}</p>
            <p class="card-subtitle h6 mb-2 text-muted">${eachPoly.location.address} ${eachPoly.location.postcode}</p>
            <a href="#" class="card-link">Find nearest carpark</a>
        </div>
        </div>`)
        polyMarker.addTo(polyLayer);
        polyInfo.push(eachPoly)

    } polyLayer.addTo(baseLayer);

    let parkingLots = await getLots();

    // converting  x/y coords from SVG21 to lat/long, 
    // creating new object to store name, add and lat/long
    for (let eachLot in parkingLots) {
        let x = parkingLots[eachLot].x_coord;
        let y = parkingLots[eachLot].y_coord;
        let coordinates = proj4("EPSG:3414").inverse([Number(x), Number(y)])

        let a = parkingLots[eachLot].car_park_no;
        let b = parkingLots[eachLot].address;

        let data = {

            "carparkName": a,
            "carparkAdd": b,
            "coordinates": coordinates
        }
        carparkInfo.push(data)
    }

    for (let xy of carparkInfo) {
        let lotCoords = [xy.coordinates[1], xy.coordinates[0]]
        let marker = L.marker(lotCoords, { icon: parkingIcon });
        marker.bindPopup(`
        ${xy.carparkName} <br> ${xy.carparkAdd}
        `)
        marker.addTo(parkingGroup)

    }
    parkingGroup.addTo(baseLayer);
})

// test 
console.log(carparkInfo)
console.log(polyInfo)

// function getBounds(coords) {

// }
resultArr = []
document.querySelector('#click').addEventListener('click', async function () {
    searchResult.clearLayers();
    baseLayer.clearLayers()

    let searchItem = document.querySelector("#search-input").value.toLowerCase().trim()
    let response = await locationData(searchItem);
    // selecting div to display search elements
    let searchResultElement = document.querySelector("#search-results");

    console.log(searchItem)

    for (let each of polyInfo) {
        let coordinate = [each.geocodes.main.latitude, each.geocodes.main.longitude];

        map.flyTo(coordinate, 16);
        polyMarker.openPopup();
        polyLayer.addTo(map);
        let circle = L.circle([each.geocodes.main.latitude, each.geocodes.main.longitude], {
            color: 'yellow',
            fillColor: 'grey',
            fillOpacity: 0.5,
            radius: 500
        });

        // let carparkInRadius =  user onclick select poly find radius and display markers of carparks around there.

        resultArr.push(each.name)

        let fakeDiv = document.createElement('div');
        // let find = resultArr.includes(searchItem.toLowerCase().trim())
        // console.log(find);

        fakeDiv.innerHTML =  `${each.name}`
        // fakeDiv.className = 'search-result';
        // fakeDiv.innerHTML = `<ul><li>${searchItem}</li></ul>`
        // fakeDiv.className = 'search-result';
        fakeDiv.addEventListener('click', function () {
            map.flyTo(coordinate, 15);
            polyMarker.openPopup();
        })



        // resultDiv.innerHTML = `<ul><li>${searchItem}</li></ul>`
        // resultDiv.className = 'search-result';
        // resultDiv.addEventListener('click', function () {
        //     map.flyTo(coordinate, 15);
        //     polyMarker.openPopup();
        // })
        circle.addTo(searchResult)
        searchResultElement.appendChild(fakeDiv);
        parkingGroup.addTo(map)

    }


})

console.log(resultArr)

let baseRadio = {
    "View All": baseLayer
}

let layerCheckbox = {
    "Polyclinics": polyLayer,
    "Parking Lots": parkingGroup,
}

L.control.layers(baseRadio, layerCheckbox).addTo(map);
let currentLocation = L.control.locate({
    drawMarker: true,
    drawCircle: false,
}).addTo(map);

let user = [currentLocation._map._lastCenter.lat, currentLocation._map._lastCenter.lng]

console.log(currentLocation._map._lastCenter.lat, currentLocation._map._lastCenter.lng)
console.log(user)

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

function carparkInRadius(user) {
    let newLayer = L.markerClusterGroup()
    for (let item in polyInfo) {
        var latPos = user[0];
        var lngPos = user[1];
        var latCP = polyInfo.geocodes.main.latitude;
        var lngCP = polyInfo.geocodes.main.longitude;
        var distance = getDistanceFromLatLonInKm(latPos, lngPos, latCP, lngCP).toFixed(2) * 1000;
        if (distance <= radius) {
            var cp = {
                lat: latCP,
                lng: lngCP
            }
            let marker = L.marker(cp)
        }marker.addTo(newLayer)
    }newLayer.addTo(map)
}
console.log(carparkInRadius())

document.querySelector("#about").addEventListener("click", function() {
    let pages = document.querySelectorAll(".page")
    for (let p of pages) {
        p.classList.remove("showing");
        p.classList.add("hidden")
    }

    let about = document.querySelector("#page-two");
    about.classList.remove("hidden");
    about.classList.add("showing");
})

document.querySelector("#home").addEventListener("click", function() {
    let pages = document.querySelectorAll(".page")
    for (let p of pages) {
        p.classList.remove("showing");
        p.classList.add("hidden")
    }

    let about = document.querySelector("#main-map");
    about.classList.remove("hidden");
    about.classList.add("showing");
})

document.querySelector("#work-in-prog").addEventListener("click", function() {
    let pages = document.querySelectorAll(".page")
    for (let p of pages) {
        p.classList.remove("showing");
        p.classList.add("hidden")
    }

    let about = document.querySelector("#page-three");
    about.classList.remove("hidden");
    about.classList.add("showing");
})

document.querySelector("#contact-us").addEventListener("click", function() {
   
    let pages = document.querySelectorAll(".page")
    for (let p of pages) {
        p.classList.remove("showing");
        p.classList.add("hidden")
    }

    let about = document.querySelector("#form-page");
    about.classList.remove("hidden");
    about.classList.add("showing");
})