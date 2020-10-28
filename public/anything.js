
const btn = document.getElementById('upload');
const lat = document.getElementById('lat');
const long = document.getElementById('long');
const textInput = document.getElementById('yourName');
const weatherP = document.getElementById('weather');
const humidityP = document.getElementById('humidity');

function getGeo() {
    if ('geolocation' in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(async position => {

            const timestamp = position.timestamp;
            const { latitude, longitude } = position.coords;
            lat.textContent = "Latitude is: " + latitude.toFixed(3) + 'º';
            long.textContent = "Longitude is: " + longitude.toFixed(3) + 'º';
            //console.log(image64);
            const data = { latitude, longitude, timestamp };
            console.log(data);
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json", },
            }
            const response = await fetch('/api', options)
            const json = await response.json();
            const weather = json.weather;
            console.log(weather);
            weatherP.textContent = "Weather is: " + weather + "º";
            const humidity = json.humidity;
            console.log(humidity);
            humidityP.textContent = "Humidity is: " + humidity + "%";
            console.log(json.AQ);
        })
    }
}
btn.addEventListener('click', () => {
    getGeo();
})





