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
    return response.data
}

