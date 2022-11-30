import axios from 'axios';


function getEvents(lat,lon) {
    axios.get(`https://api.tomtom.com/search/2/categorySearch/recreation.json?key=XJTrt6uiszGL5kycM0FZLHZF6rbXEyQ2&lat=${lat}&lon=${lon}`)
    .then(data => {
        console.log(data)
    })
    
}

function getzip(zip) {
axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=54a60b82927ece1254952b9dbcf68376`)
.then(data => {
const lat = data.data.lat;
const lon = data.data.lon;
getEvents(lat,lon)



})


}

export default function Eventlist(zip) {
getzip(zip)
}


