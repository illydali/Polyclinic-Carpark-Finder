let singapore = [1.36, 103.85];
let map = L.map("main-map").setView(singapore, 14);

// setting up map
let mainView = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "sk.eyJ1IjoiNmlsbHkiLCJhIjoiY2t6dGoxaHJlMGNzZzJvbnduZGdic2lvbyJ9.8s5meHPYaHhf-IOxa03MxA"
}).addTo(map);

let nightSG = L.tileLayer('https://maps-{s}.onemap.sg/v3/Night/{z}/{x}/{y}.png', {
    minZoom: 11,
    maxZoom: 18,
    bounds: [[1.56073, 104.11475], [1.16, 103.502]],
    attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
});

proj4.defs("EPSG:3414", "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");

// setting up icons
let polyIcon = L.icon({
    iconUrl: '/icons/clinic-final.svg',
    iconSize: [40, 40],
    popupAnchor: [0, 0]
});

let parkingIcon = L.icon({
    iconUrl: '/icons/parking-side.svg',
    iconSize: [40, 40],
    popupAnchor: [0, 0]
})

let userIcon = L.icon({
    iconUrl: '/icons/person.svg',
    iconSize: [40, 40],
    popupAnchor: [0, 0]
})

let clubIcon = L.icon({
    iconUrl: '/icons/cclub.svg',
    iconSize: [40, 40],
    popupAnchor: [0, 0]
})

// setting up layers
let baseLayer = L.layerGroup();
let tileLayers = L.layerGroup();
let polyLayer = L.markerClusterGroup();
let parkingGroup = L.markerClusterGroup();
let searchResult = L.layerGroup();
let clubLayer = L.geoJson();
let layerUserLocation = L.layerGroup()

searchResult.addTo(map);

let carparkData = [];
let polyInfo = [];

window.addEventListener("DOMContentLoaded", async function () {
    baseLayer.clearLayers();

    let location = await locationData();
    for (let eachPoly of location) {
        let polyCoordinates = [eachPoly.geocodes.main.latitude, eachPoly.geocodes.main.longitude]
        polyMarker = L.marker(polyCoordinates, { icon: polyIcon });
        polyMarker.bindPopup(`
        <h6>
        <img src="icons/clinic-info.png">        
        ${eachPoly.name}</h6>
        <br>
        <h6 mb-2 text-muted">${eachPoly.location.formatted_address}</h6>        
        `)
        polyMarker.addTo(polyLayer);
        polyInfo.push(eachPoly)

    }
    polyLayer.addTo(baseLayer);

    let geoClubFeature = await loadClubInfo();
    clubLayer = new L.geoJson(geoClubFeature, {
        pointToLayer: function(feature, latlng) {
            return new L.Marker(latlng, {
                icon: clubIcon
            });
        },
        onEachFeature: function (feature, layer) {
            let newDiv = document.createElement("div");

            newDiv.innerHTML = feature.properties.Description
            let columns = newDiv.querySelectorAll("td");
            let name = columns[9].innerHTML;
            let addressNumber = columns[0].innerHTML;
            let postalCode = columns[2].innerHTML;
            let streetName = columns[3].innerHTML;
            let website = columns[6].innerHTML;

            layer.bindPopup(`            
            <div class="card-body p-0 m-0 text-center">
                <p class="card-title fs-5">${name}</p> 
                <p class="card-subtitle fs-6"> ${addressNumber}, ${streetName}, ${postalCode}</p>
                <a href="#" class="card-link fs-6 fst-italic text-reset" >${website}</a>
            </div>`)
        }

    }).addTo(baseLayer)

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
                    "last_updated": availableLots[free].update_datetime,
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
        <h6>
        <img src="icons/car.png"/>
        ${carparkData[xy].carpark_number}: ${carparkData[xy].address}</h6>
        
        <h6>
        <i class="fa-solid fa-car-side"></i>
        Available Lots: ${carparkData[xy].lots_available}
        </h6>
        
        <h6>
        <i class="fa-solid fa-barcode"></i>
        Info: ${carparkData[xy].car_park_type}
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

// searching for polyclinic information and adding to list.
document.querySelector('#myButton').addEventListener("click", function () {
    searchResult.clearLayers();
    baseLayer.clearLayers()

    let polyList = document.querySelector("#mainList");

    L.Circle.include({
        contains: function (latlng) {
            return this.getLatlng().distanceTo(latlng) < this.getRadius();
        }
    })

    for (let each of polyInfo) {
        let coordinate = [each.geocodes.main.latitude, each.geocodes.main.longitude];
        let listItems = document.createElement('div');
        let circle = L.circle(coordinate, 500)

        listItems.innerHTML = `<class="card card-body py-1">${each.name}</>
        `
        listItems.className = "list-result"
        listItems.addEventListener("click", function () {
            circle.addTo(searchResult)
            parkingGroup.addTo(searchResult)
            map.flyTo(coordinate, 17);
            polyMarker.openPopup();
        })
        polyLayer.addTo(searchResult)
        parkingGroup.addTo(searchResult)
        polyList.appendChild(listItems);
    }
})

nightSG.addTo(tileLayers),
    mainView.addTo(tileLayers)
let radioButton = {
    "Main": mainView,
    "Night Mode": nightSG,
}

let layerCheckbox = {
    "View All": baseLayer,
    "Polyclinics": polyLayer,
    "Parking Lots": parkingGroup,
    "Community Clubs": clubLayer,
}

L.control.layers(radioButton, {}).addTo(map);

let scrollDiv = document.querySelector("#mainList")
L.DomEvent.disableScrollPropagation(scrollDiv);

// load homepage upon opening app/website
document.querySelector("#enter").addEventListener("click", function () {
    let info = document.querySelector("#infoBar");
    info.style = "z-index: 1030"
    info.classList.remove("hidden")
    info.classList.add("shown")

    let home = document.querySelector("#homepage");
    home.classList.remove("shown");
    home.classList.add("hidden");

    let map = document.querySelector("#main-map")
    map.classList.remove("hidden")
    map.classList.add("shown")
})

// sign up form validation
document.querySelector("#sendButton").addEventListener("click", function () {
    let nameEmpty = false;
    let nameTooShort = false;
    let invalidEmail = false;
    let name = document.querySelector("#inputName").value;
    if (!name) {
        nameEmpty = true;
    } else if (name.length < 3) {
        nameTooShort = true;
    }
    let email = document.querySelector("#inputEmail").value;
    if (!email.includes(".") || !email.includes("@")) {
        invalidEmail = true;
    }
    if (nameEmpty || nameTooShort || invalidEmail) {
        let error = document.querySelector("#errorMessage");
        error.innerHTML = "";
        error.style.display = "block";
        if (nameEmpty) {
            error.innerHTML += `<p>Please fill in your name.</p>`;
        }
        if (nameTooShort) {
            error.innerHTML += '<p>Please enter your full name.</p>';
        }
        if (invalidEmail) {
            error.innerHTML += '<p>Email should contain one . and one @</p>';
        }
    }
    else {
        let success = document.getElementById("success");
        let error = document.querySelector("#errorMessage");
        error.style.display = "none"
        success.innerHTML = "";
        success.style.display = "block"
        success.innerHTML = "Thank you! Your email has been added."
    }
})

// finding user location
function showCurrentLocation() {
    map.locate({ setView: true, maxZoom: 16 });
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}

// get user location, circle to indicate 500m radius, show carpark icons
function onLocationFound(e) {
    layerUserLocation.clearLayers();
    map.removeLayer(layerUserLocation);
    let radius = 500;
    let user = L.marker(e.latlng, { icon: userIcon });
    user.addTo(layerUserLocation);
    user.bindPopup(`You are here`).openPopup();
    L.circle(e.latlng, radius).addTo(layerUserLocation);
    parkingGroup.addTo(layerUserLocation)
    layerUserLocation.addTo(map)
}

// handle location error
function onLocationError(e) {
    if (map.hasLayer(layerUserLocation)) {
        layerUserLocation.clearLayers();
        map.removeLayer(layerUserLocation);
    }
    alert(e.message,"Location not detected");
}

document.getElementById("showLocation").addEventListener("click", function () {
    showCurrentLocation()
})

document.getElementById("reset").addEventListener("click", function () {
    map.removeLayer(layerUserLocation)
})

// filter tab
document.getElementById("nav-layers").addEventListener("click", function (){
    map.removeLayer(searchResult)
    map.removeLayer(layerUserLocation)
    map.setView(singapore,14)
})

let checkboxes = document.querySelectorAll(".checkgroup");

for (each of checkboxes) {
    each.addEventListener("click", function () {
        let val = (this.value)
        if (val == "parking-group") {
            if (document.getElementById("park").checked) {
                parkingGroup.addTo(map)
            } else map.removeLayer(parkingGroup) 
        } if (val == "poly-layer") {
            if (document.getElementById("poly").checked) {
                polyLayer.addTo(map)
            } else map.removeLayer(polyLayer)
        } else if (val == "community-centres") {
            if (document.getElementById("club").checked) {
                clubLayer.addTo(map)
            } else map.removeLayer(clubLayer)
        }
    })
}

// close tab
document.getElementById("nav-toggle").addEventListener("click", function () {
    let isShown = false;
    for (let pane of document.querySelectorAll(".tab-pane")) {
        if (pane.classList.contains("active")) {
            isShown = true;
        }
    }
    if (isShown) {
        for (let pane of document.querySelectorAll(".tab-pane")) {
            pane.classList.remove("show");
            pane.classList.remove("active");
            pane.classList.remove("fade")
        }
    }
})