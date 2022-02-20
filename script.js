let singapore = [1.29,103.85]; 
let map = L.map("main-map").setView(singapore, 13); 

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "sk.eyJ1IjoiNmlsbHkiLCJhIjoiY2t6dGoxaHJlMGNzZzJvbnduZGdic2lvbyJ9.8s5meHPYaHhf-IOxa03MxA"
}).addTo(map);

let markerClusterLayer = L.markerClusterGroup();

window.addEventListener("DOMContentLoaded", async function (){
    let location = await locationData();
    let markerClusterLayer = L.markerClusterGroup();

    for (let eachPoly of location) {
        let coordinates = [eachPoly.geocodes.main.latitude, eachPoly.geocodes.main.longitude];
        let marker = L.marker(coordinates);
        marker.bindPopup(`<div>${eachPoly.name}</div>`)
        marker.addTo(markerClusterLayer);

    } markerClusterLayer.addTo(map);
})