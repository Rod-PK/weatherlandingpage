// Function to fetch weather based on city search using Open-Meteo Geocoding API and Met.no Weather API
async function getWeather() {
    const city = document.getElementById('search').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    // Fetch coordinates using Open-Meteo Geocoding API
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    try {
        const response = await fetch(geocodingUrl);
        const locationData = await response.json();

        if (!locationData.results || locationData.results.length === 0) {
            alert('City not found');
            return;
        }

        const { latitude, longitude, name } = locationData.results[0];


        fetchWeatherByCoordinates(latitude, longitude, name);
        fetchUVIndex(latitude, longitude);
        fetchAirQuality(latitude, longitude);
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}

// Function to fetch weather data using Met.no API
async function fetchWeatherByCoordinates(lat, lon, city) {
    const weatherUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
    try {
        const response = await fetch(weatherUrl, {
    
        });
        const weatherData = await response.json();

        // Extract relevant data from the weatherData object
        const currentWeather = weatherData.properties.timeseries[0].data.instant.details;
        const sunrise = new Date(weatherData.properties.meta.units.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(weatherData.properties.meta.units.sunset * 1000).toLocaleTimeString();

        // Update the HTML with the fetched weather data
        document.getElementById('location').innerText = city;
        document.getElementById('temperature').innerText = `${Math.round(currentWeather.air_temperature)}°C`;
        document.getElementById('description').innerText = "Real-time weather data"; // Custom description for Met.no data
        document.getElementById('rain').innerText = `Precipitation - ${weatherData.properties.timeseries[0].data.next_1_hours?.details?.precipitation_amount || 0} mm`;
        document.getElementById('wind-status').innerText = `${currentWeather.wind_speed} m/s`;
        document.getElementById('humidity').innerText = `${currentWeather.relative_humidity}%`;
        document.getElementById('visibility').innerText = `${(currentWeather.visibility / 1000).toFixed(1)} km`;

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to fetch UV index (from OpenWeather or similar APIs)
async function fetchUVIndex(lat, lon) {
    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=0373424548ccac1da4810e0355f21b0d`; // Replace with your OpenWeatherMap API key
    try {
        const response = await fetch(uvUrl);
        const uvData = await response.json();

        // Update the HTML with UV index
        document.getElementById('uv-index').innerText = uvData.value;
    } catch (error) {
        console.error('Error fetching UV index:', error);
    }
}

// Function to fetch air quality data (can use OpenWeather or other APIs)
async function fetchAirQuality(lat, lon) {
    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=0373424548ccac1da4810e0355f21b0d`; // Replace with your OpenWeatherMap API key
    try {
        const response = await fetch(airQualityUrl);
        const airQualityData = await response.json();

        const aqi = airQualityData.list[0].main.aqi; // Air Quality Index (1-5 scale)
        const aqiDescription = getAQIDescription(aqi);

        // Update the HTML with air quality info
        document.getElementById('air-quality').innerText = `${aqi} - ${aqiDescription}`;
    } catch (error) {
        console.error('Error fetching air quality data:', error);
    }
}

// Helper function to convert AQI index into readable format
function getAQIDescription(aqi) {
    switch (aqi) {
        case 1: return 'Good';
        case 2: return 'Fair';
        case 3: return 'Moderate';
        case 4: return 'Poor';
        case 5: return 'Very Poor';
        default: return 'Unknown';
    }
}
