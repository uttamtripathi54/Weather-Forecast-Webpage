// --- Configuration ---
const weatherApi = {
    // IMPORTANT: Storing API keys directly in client-side code is insecure.
    // Ideally, this key should be handled by a backend server.
    // For this example, it's kept here, but be aware of the risks.
    key: "bab281d79e5f1e9755a68d754cc313e7", // API Key from original code
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

// --- DOM Elements ---
const searchInputBox = document.getElementById('search-bar');
const weatherBody = document.getElementById('weather-body');
const cityElement = document.getElementById('city');
const dateElement = document.getElementById('date');
const tempElement = document.getElementById('temp');
const minMaxTempElement = document.getElementById('min-max');
const weatherConditionElement = document.getElementById('weather-condition');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const errorMessageElement = document.getElementById('error-message');

// --- Event Listeners ---
searchInputBox.addEventListener('keypress', handleSearch);

// --- Functions ---

// Handle search input
function handleSearch(event) {
    if (event.keyCode === 13) { // 13 is the Enter key
        const query = searchInputBox.value.trim();
        if (query) {
            clearError();
            // Optional: Add a simple loading indicator here
            // e.g., errorMessageElement.textContent = "Loading...";
            getWeatherReport(query);
        } else {
            showError("Please enter a city name.");
        }
        searchInputBox.value = ""; // Clear input after search
    }
}

// Get Weather Report from API
function getWeatherReport(city) {
    const url = `${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Handle HTTP errors (like 404 Not Found)
                throw new Error(`City not found or API error (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            clearError(); // Clear any previous errors or loading message
            showWeatherReport(data);
            weatherBody.style.display = "block"; // Show weather info section
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            showError(error.message || "Could not fetch weather data.");
            weatherBody.style.display = "none"; // Hide weather info on error
        });
}

// Show Weather Report in the UI
function showWeatherReport(weather) {
    if (!weather || !weather.main || !weather.sys || !weather.weather || !weather.weather[0]) {
        showError("Received incomplete weather data.");
        return;
    }

    cityElement.textContent = `${weather.name}, ${weather.sys.country}`;
    dateElement.textContent = formatDate(new Date()); // Use enhanced date formatting
    tempElement.innerHTML = `${Math.round(weather.main.temp)}&deg;C`;
    minMaxTempElement.innerHTML = `${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)`;
    weatherConditionElement.textContent = weather.weather[0].main;
    humidityElement.textContent = weather.main.humidity;
    pressureElement.textContent = weather.main.pressure;

    updateBackground(weather.weather[0].main);
}

// Update background based on weather condition
function updateBackground(weatherType) {
    const body = document.body;
    // Remove previous weather classes
    body.className = ''; // Clear all classes first, or selectively remove weather-* classes

    switch (weatherType.toLowerCase()) {
        case 'clear':
            body.classList.add('weather-clear');
            break;
        case 'clouds':
        case 'haze': // Group Haze with Clouds visually
            body.classList.add('weather-clouds');
            break;
        case 'rain':
        case 'drizzle': // Added Drizzle
            body.classList.add('weather-rain');
            break;
        case 'snow':
            body.classList.add('weather-snow');
            break;
        case 'thunderstorm':
            body.classList.add('weather-thunderstorm');
            break;
        // Add more cases as needed (Mist, Fog, etc.)
        default:
             // Keep default background or add a specific one
            // body.classList.add('weather-default');
            break;
    }
}


// Format Date
function formatDate(dateArg) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];

    return `${date} ${month} (${day}), ${year}`;
}

// Show error message
function showError(message) {
    errorMessageElement.textContent = message;
}

// Clear error message
function clearError() {
    errorMessageElement.textContent = '';
}

// Initial setup - maybe display weather for a default city or based on geolocation if desired
// For now, just set the date
dateElement.textContent = formatDate(new Date());