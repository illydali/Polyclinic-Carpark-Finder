const BASE_API_URL = "https://api.foursquare.com/v3/places/search";
const API_KEY = "fsq3q5NxJu+3MIn5hbGdBaeBSB4X1cxKWDsthWb+r1SO/2A=";

async function locationData() {
    let response = await axios.get(BASE_API_URL, {
        params: {
            "query": "polyclinic",
            "v": "20220219",
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

