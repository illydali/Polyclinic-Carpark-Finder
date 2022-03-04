let singapore = [1.36, 103.85];
let map = L.map("main-map").setView(singapore, 14);

let mainView = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "sk.eyJ1IjoiNmlsbHkiLCJhIjoiY2t6dGoxaHJlMGNzZzJvbnduZGdic2lvbyJ9.8s5meHPYaHhf-IOxa03MxA"
}).addTo(map);

proj4.defs("EPSG:3414", "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");

let OneMapSG = L.tileLayer('https://maps-{s}.onemap.sg/v3/Original/{z}/{x}/{y}.png', {
	minZoom: 11,
	maxZoom: 18,
	bounds: [[1.56073, 104.11475], [1.16, 103.502]],
	attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
})

// setting up icons
let polyIcon = L.icon({
    iconUrl: '/icons/health-care.svg',
    iconSize: [40, 40],
    popupAnchor: [0, 0]
});

let parkingIcon = L.icon({
    iconUrl: '/icons/parking-side.svg',
    iconSize: [40, 40],
    popupAnchor: [0, 0]
})

// setting up layers
let tileLayers = L.layerGroup()
let polyLayer = L.markerClusterGroup();
let parkingGroup = L.markerClusterGroup();
let polyMarker = L.marker;
let baseLayer = L.layerGroup()
let searchResult = L.layerGroup()
searchResult.addTo(map);


let carparkData = []
let polyInfo = [];

window.addEventListener("DOMContentLoaded", async function () {
    baseLayer.clearLayers();
    let location = await locationData();
    for (let eachPoly of location) {
        let polyCoordinates = [eachPoly.geocodes.main.latitude, eachPoly.geocodes.main.longitude]
        polyMarker = L.marker(polyCoordinates, { icon: polyIcon });
        polyMarker.bindPopup(`
        <div class="card bg-light border-0 m-0 p-0" style="width: 10rem">
        <div class="card-body" >
            <p class="card-title h6">${eachPoly.name}</p>
            <p class="card-subtitle h6 mb-2 text-muted">${eachPoly.location.formatted_address}</p>
        </div>
        </div>`)
        polyMarker.addTo(polyLayer);
        polyInfo.push(eachPoly)

    } polyLayer.addTo(baseLayer);
    console.log(polyInfo)
    let parkingLots = await getLots();
    let availableLots = await getCarparks();

    for (let free in availableLots) {
        let tempArr = [];
        tempArr[free] = { "carpark_number": availableLots[free].carpark_number }
        for (let eachLot in parkingLots) {
            let x = parkingLots[eachLot].x_coord;
            let y = parkingLots[eachLot].y_coord;
            let coordinates = proj4("EPSG:3414").inverse([Number(x), Number(y)])

            if (parkingLots[eachLot].car_park_no == tempArr[free].carpark_number) {
                carparkData[free] = {
                    "carpark_number": availableLots[free].carpark_number,
                    "address": parkingLots[eachLot].address,
                    "lat": coordinates[0],
                    "lng": coordinates[1],
                    "lot_type": availableLots[free].carpark_info[0].lot_type,
                    "lots_available": availableLots[free].carpark_info[0].lots_available,
                    "total_lots": availableLots[free].carpark_info[0].total_lots,
                    "last_updated" : availableLots[free].update_datetime,
                    "car_park_type": parkingLots[eachLot].car_park_type,
                    "parking_system": parkingLots[eachLot].type_of_parking_system,
                    "free_parking": parkingLots[eachLot].free_parking
                }
            }
        }
    }

    for (let xy in carparkData) {
        let lotCoords = [carparkData[xy].lng, carparkData[xy].lat] // [0].lat
        let marker = L.marker(lotCoords, { icon: parkingIcon });
        marker.bindPopup(`
        <img src="icons/car.png"/>
        <h6>${carparkData[xy].carpark_number}: ${carparkData[xy].address}</h6>
        
        <h6>
        <i class="fa-solid fa-car-side"></i>
        Available Lots: ${carparkData[xy].lots_available}
        </h6>
        
        <h6>
        <i class="fa-solid fa-barcode"></i>
        Carpark Type: ${carparkData[xy].parking_system}
        </h6>
       
        <h6>
        <i class="fa-solid fa-arrows-rotate"></i>
        Last Updated: ${carparkData[xy].last_updated}
        </h6>
        `)
        marker.addTo(parkingGroup)

    }
    parkingGroup.addTo(baseLayer);
})

document.querySelector('#myButton').addEventListener('click', function () {
    searchResult.clearLayers();
    baseLayer.clearLayers()

    let searchResultElement = document.querySelector("#mainList");
    
    for (let each of polyInfo) {
        let coordinate = [each.geocodes.main.latitude, each.geocodes.main.longitude];

        map.flyTo(coordinate, 16);
        polyMarker.openPopup();
        polyLayer.addTo(map);
        // L.Circle.include({
        //     contains: function (latlng) {
        //         return this.getLatlng().distanceTo(latlng) < this.getRadius();
        //     }
        // })
        // let circle = L.circle(coordinates, 500)
        // map.fitBounds(circle.getBounds());
        // polyMarker.on('click', function (showCircle) {
        //     let result = (circle.contains(polyMarker.getLatLng())) 
        //     if (result < circle.rad)
        //     circle.addto(map)
        //   });


        let circle = L.circle([each.geocodes.main.latitude, each.geocodes.main.longitude], {
            color: 'yellow',
            fillColor: 'grey',
            fillOpacity: 0.5,
            radius: 500,
        });

        // let carparkInRadius =  user onclick select poly find radius and display markers of carparks around there.

        let listItems = document.createElement('div');

        listItems.innerHTML = `<class="card card-body">${each.name}</>
        `
        listItems.className = "list-result"
        listItems.addEventListener('click', function () {
            map.flyTo(coordinate, 15);
            polyMarker.openPopup();
        })

        circle.addTo(searchResult)
        searchResultElement.appendChild(listItems);
        parkingGroup.addTo(map)

    }


})

OneMapSG.addTo(tileLayers),
mainView.addTo(tileLayers)
let radioButton = {
    "Main View" : mainView,
    "MRT Lines" : OneMapSG,
}

let layerCheckbox = {
    "View All" : baseLayer,
    "Polyclinics": polyLayer,
    "Parking Lots": parkingGroup,
}

L.control.layers(radioButton,layerCheckbox).addTo(map);
let currentLocation = L.control.locate({
    drawMarker: true,
    drawCircle: false,
}).addTo(map);

let user = [currentLocation._map._lastCenter.lat, currentLocation._map._lastCenter.lng]

console.log(currentLocation._map._lastCenter.lat, currentLocation._map._lastCenter.lng)
console.log(user)

// function carparkInRadius(user) {

//     let newLayer = L.markerClusterGroup()
//     for (let item in polyInfo) {
//         let latPos = user[0];
//         let lngPos = user[1];
//         let latCP = polyInfo.geocodes.main.latitude;
//         let lngCP = polyInfo.geocodes.main.longitude;
//         let distance = getDistanceFromLatLonInKm(latPos, lngPos, latCP, lngCP).toFixed(2) * 1000;
//         if (distance <= radius && test[item].lots_available > 0) {
//             var cp = {
//                 lat: latCP,
//                 lng: lngCP
//             }
//             let marker = L.marker(cp)
//             marker.addTo(newLayer)
//         } newLayer.addTo(map)
//     }
// }

document.querySelector("#about").addEventListener("click", function () {
    let pages = document.querySelectorAll(".page")
    for (let p of pages) {
        p.classList.remove("show");
        p.classList.add("hidden")
    }

    let about = document.querySelector("#page-two");
    about.classList.remove("hidden");
    about.classList.add("show");
})

document.querySelector("#home").addEventListener("click", function () {
    let pages = document.querySelectorAll(".page")
    for (let p of pages) {
        p.classList.remove("show");
        p.classList.add("hidden")
    }

    let home = document.querySelector("#main-map");
    home.classList.remove("hidden");
    home.classList.add("show");
})

document.querySelector("#work-in-prog").addEventListener("click", function () {
    let pages = document.querySelectorAll(".page")
    for (let p of pages) {
        p.classList.remove("show");
        p.classList.add("hidden")
    }

    let workInProgress = document.querySelector("#page-three");
    workInProgress.classList.remove("hidden");
    workInProgress.classList.add("show");
})

document.querySelector("#contact-us").addEventListener("click", function () {

    let pages = document.querySelectorAll(".page")
    for (let p of pages) {
        p.classList.remove("show");
        p.classList.add("hidden")
    }

    let form = document.querySelector("#page-four");
    form.classList.remove("hidden");
    form.classList.add("show");
})

let scrollDiv = document.querySelector("#mainList") 
L.DomEvent.disableScrollPropagation(scrollDiv);