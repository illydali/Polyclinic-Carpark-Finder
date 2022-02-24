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
    iconUrl: '/icons/marker.png',
    // shadowUrl: 'leaf-shadow.png',

    iconSize: [38, 95], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


window.addEventListener("DOMContentLoaded", async function () {
    let location = await locationData();
    let markerClusterLayer = L.markerClusterGroup();

    for (let eachPoly of location) {
        let polyCoordinates = [eachPoly.geocodes.main.latitude, eachPoly.geocodes.main.longitude];
        let marker = L.marker(polyCoordinates, { icon: heartIcon });
        marker.bindPopup(`
        <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${eachPoly.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${eachPoly.location.address} ${eachPoly.location.postcode}</h6>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="card-link">Check nearest carpark</a>
            <a href="#" class="card-link">Another link</a>
        </div>
        </div>`)


        // <div>${eachPoly.location.postcode}</div>`)
        marker.addTo(markerClusterLayer);

    } markerClusterLayer.addTo(map);

    let parkingLots = await getLots();
    let xyCoords = [];
    for (let eachLot in parkingLots) {
        let x = parkingLots[eachLot].x_coord;
        let y = parkingLots[eachLot].y_coord;
        let points = {
            "x": x,
            "y": y
        }
        xyCoords.push(points)
    }
    console.log(xyCoords)
    // let lotMarkerCluster = L.markerClusterGroup()
    let transformed = [];
    for (let eachLot of xyCoords) {
        let points = proj4("EPSG:3414").inverse([Number(eachLot.x), Number(eachLot.y)]);

        let newCoords = {
            "x": points[1],
            "y": points[0],
        }
        transformed.push(newCoords)
    }
    
    let testgroup = L.layerGroup()
    for (let xy of transformed) {
        let lotCoords = [xy.x, xy.y]
        let circle = L.circle(lotCoords, {
            color: "lightgrey",
            radius: 200,
            fillColor: 'grey',
            fillOpacity: 0.2,
        })
        circle.addTo(testgroup)
        
    } testgroup.addTo(map);
})

document.querySelector("#search-btn").addEventListener("click", function () {
    alert("Hello")
    let search = document.querySelector("#search-input").value;
    console.log(search)
})




