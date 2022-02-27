let singapore = [1.29, 103.85];
let map = L.map("main-map").setView(singapore, 13);

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "sk.eyJ1IjoiNmlsbHkiLCJhIjoiY2t6dGoxaHJlMGNzZzJvbnduZGdic2lvbyJ9.8s5meHPYaHhf-IOxa03MxA"
}).addTo(map);

proj4.defs("EPSG:3414", "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");

let heartIcon = L.icon({
    iconUrl: '/icons/poly-blood.svg',
    iconSize: [30,30],
    iconAnchor: [22, 94], 
    popupAnchor: [-3, -76] 
});

let parkingIcon = L.icon({
    iconUrl: '/icons/parking-pin.svg',
    iconSize: [30,30],
    iconAnchor: [22, 94], 
    popupAnchor: [-3, -76] 
})

let polyLayer = L.markerClusterGroup();
// let parkingGroup = L.layerGroup();

let parkingGroup = L.markerClusterGroup()

window.addEventListener("DOMContentLoaded", async function () {

    let location = await locationData();
    // let polyLayer = L.markerClusterGroup();

    for (let eachPoly of location) {
        let polyCoordinates = [eachPoly.geocodes.main.latitude, eachPoly.geocodes.main.longitude];
        let marker = L.marker(polyCoordinates, { icon: heartIcon });
        marker.bindPopup(`
        <div class="card bg-light border-0 m-0 p-0" style="width: 10rem">
        <div class="card-body h-100">
            <p class="card-title h6">${eachPoly.name}</p>
            <p class="card-subtitle h6 mb-2 text-muted">${eachPoly.location.address} ${eachPoly.location.postcode}</p>
            <a href="#" class="card-link">Find nearest carpark</a>
        </div>
        </div>`)
        marker.addTo(polyLayer);

    } polyLayer.addTo(map);

    let parkingLots = await getLots();
    let carparkInfo = [];

    // converting  x/y coords from SVG21 to lat/long, 
    // creating new object to store name, add and lat/long
    for (let eachLot in parkingLots) {
        let x = parkingLots[eachLot].x_coord;
        let y = parkingLots[eachLot].y_coord;
        let coordinates = proj4("EPSG:3414").inverse([Number(x), Number(y)])

        let a = parkingLots[eachLot].car_park_no;
        let b = parkingLots[eachLot].address;
        
        let data = {

            "cp_name" : a,
            "cp_add" : b,
            "coordinates" : coordinates
        }
        carparkInfo.push(data)
    } 

    for (let xy of carparkInfo) {
        let lotCoords = [xy.coordinates[1], xy.coordinates[0]]
        let marker = L.marker(lotCoords, { icon: parkingIcon });
        marker.bindPopup(`
        ${xy.cp_name} <br> ${xy.cp_add}
        `)
        

        marker.addTo(parkingGroup) 
    
    }
     parkingGroup.addTo(map);
})

// document.querySelector("#click").addEventListener("click", function () {
//     document.querySelector("click").style.display="none"
// })

let layerCheckbox = {
    "Polyclinics" : polyLayer,
    "Parking Lots" : parkingGroup,
}

L.control.layers({}, layerCheckbox).addTo(map);


// navigator.geolocation.getCurrentPosition(position => {
//     const { coords: { latitude, longitude } } = position;
//     var marker = new L.marker([latitude, longitude], {
//       draggable: true,
//       autoPan: true
//     }).addTo(map);
// })



