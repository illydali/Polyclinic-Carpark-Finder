const BASE_API_URL = "https://api.foursquare.com/v3/places/search";
const API_KEY = "fsq3q5NxJu+3MIn5hbGdBaeBSB4X1cxKWDsthWb+r1SO/2A=";

async function locationData() {
    let response = await axios.get(BASE_API_URL, {
        params: {
            "query": "polyclinic",
            "v": "20220303",
            "categories": "15000",
            "near": "singapore",
            "limit": "50",
        },
        headers: {
            "Accept": "application/json",
            "Authorization": API_KEY,
        }
    })
    return response.data.results;
}


proj4.defs("EPSG:3414", "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");


async function getLots() {
    let response = await axios.get("datasets/result.json");
    return response.data;
}

async function getCarparks() {
    let response = await axios.get("Https://api.data.gov.sg/v1/transport/carpark-availability")
    return response.data.items[0].carpark_data;
}

async function loadClubInfo() {
    let response = await axios.get("datasets/community-clubs.geojson")
    let clubLayer = L.geoJson(response.data, {
        onEachFeature: function(feature, layer) {
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
    

    return clubLayer
}

