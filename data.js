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


proj4.defs("EPSG:3414", "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");


async function getLots() {
    let response = await axios.get("result.json");
    return response.data;
}

async function getCarparks() {
    let response = await axios.get("Https://api.data.gov.sg/v1/transport/carpark-availability")
    return response.data.items[0].carpark_data;
}
// let freeLots = getCarparks();
// let carparkData = []

// function mergeCarparkData(freeLots, carparkInfo) {
//     for (let i in freeLots) {
//         let tempArr = [];
//         tempArr[i] = { "carpark_number": freeLots[i].carpark_number }
//         for (let j in carparkInfo) {
//             if (carparkInfo[j].carparkName == tempArr[i].carpark_number) {
//                 newData = {
//                     "carpark_number": freeLots[i].carpark_number,
//                     "lot_type": freeLots[i].carpark_info[0]["lot_type"],
//                     "lots_available": freeLots[i].carpark_info[0]["lots_available"],
//                     "total_lots": freeLots[i].carpark_info[0]["total_lots"],
//                     "x_coord": carparkInfo[j].coordinates[0],
//                     "y_coord": carparkInfo[j].coordinates[1],
//                 }
//             }
//         }
//     } carparkData.push(newData)
// }

// console.log(carparkData)
// // getNewInfo(function (carparkInfo) {
// //     for (let i in freeLots) {
// //         let tempArr = [];
// //         tempArr[i] = { "carpark_number": data[i].carpark_number };
// //         for (let j in carparkInRadius) {
// //             if (carparkInfo[j].carparkName === tempArr[i].carpark_number) {
// //                 carparkData[i] = {
// //                     "carpark_number": freeLots[i].carpark_number,
// //                     "lot_type": freeLots[i].carpark_info[0]["lot_type"],
// //                     "lots_available": freeLots[i].carpark_info[0]["lots_available"],
// //                     "total_lots": freeLots[i].carpark_info[0]["total_lots"],
// //                     "x_coord": carparkInfo[j].coordinates[0],
// //                     "y_coord": carparkInfo[j].coordinates[1],
// //                 }
// //             } carparkData.push(i)
// //         }
// //     }
// // })

// // console.log(carparkData)
