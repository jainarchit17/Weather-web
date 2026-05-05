const API = "092fc96f5f422e4108b224c4f25d85cd";
let isCelsius = true;
let currentData = null;

// DOM Elements
const cityInput=document.getElementById('cityInput');
const searchBtn=document.getElementById('searchBtn');
const currentBtn=document.getElementById('currentBtn');
const errorBox=document.getElementById('errBox');
const recentBox=document.getElementById('recents');
const recentDrop=document.getElementById('recentDrop');
const mainBody=document.getElementById('mainBody');

document.addEventListener('DOMContentLoaded', loadRecentSearches);
searchBtn.addEventListener('click',()=>{
    const city=cityInput.value.trim();
    if(!city) return showError("Please enter a valid city name before searching.");
    fetchCity(city);
});

currentBtn.addEventListener('click',()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            const {latitude, longitude} = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        }, (error)=>{
            showError("Unable to retrieve your location.");
        });
    } else {
        showError("Geolocation is not supported by this browser.");
    }
});
recentDrop.addEventListener('change',(e)=>{
    const city = e.target.value;
    if(city) fetchCity(city);
});

document.getElementById('toggleUnitBtn').addEventListener('click',()=>{
    isCelsius = !isCelsius;
    if(currentData) updateCurrentUI(currentData);
});

async function fetchCity(city){
    hideError();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);
        if(!response.ok) throw new Error("City not found. Please check the spelling and try again.");
        const data = await response.json();
        saveRecentSearch(data.name);
        updateCurrentUI(data);
        fetch5DayForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError(error.message);
    }
}

async function fetchWeatherByCoordinates(lat, lon){
    hideError();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
        if(!response.ok) throw new Error("Unable to fetch weather data for your location.");
        const data = await response.json();
        saveRecentSearch(data.name);
        updateCurrentUI(data);
        fetch5DayForecast(lat, lon);
    } catch (error) {
        showError(error.message);
    }}
async function fetch5DayForecast(lat, lon){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
        if(!response.ok) throw new Error("Unable to fetch 5-day forecast data.");
        const data = await response.json();
        updateForecastUI(data);
    } catch (error) {
        showError(error.message);
    }}

function updateCurrentUI(data) {
    currentData = data;
    document.getElementById('currentCard').classList.remove('hidden');
    
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString(undefined, dateOpts);
    
    let temp = data.main.temp;
    let unitSym = "°C";
    if (!isCelsius) {
        temp = (temp * 9/5) + 32;
        unitSym = "°F";
        document.getElementById('toggleUnitBtn').innerHTML = `<i class="fa-solid fa-repeat"></i> Switch to °C`;
    } else {
        document.getElementById('toggleUnitBtn').innerHTML = `<i class="fa-solid fa-repeat"></i> Switch to °F`;
    }
    
    document.getElementById('currentTemp').textContent = `${Math.round(temp)}${unitSym}`;
    document.getElementById('currentWind').textContent = `${data.wind.speed} m/s`;
    document.getElementById('currentHumidity').textContent = `${data.main.humidity}%`;
    document.getElementById('currentDesc').textContent = data.weather[0].description;
    document.getElementById('currentIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    // Dynamic background for rainy weather
    if (data.weather[0].main.toLowerCase().includes('rain')) {
        mainBody.classList.add('rainy-bg');
    } else {
        mainBody.classList.remove('rainy-bg');
    }

    // Extreme Temp Alert
    const alertBox = document.getElementById('extremeAlert');
    data.main.temp > 40 ? alertBox.classList.remove('hidden') : alertBox.classList.add('hidden');


}
function updateForecastUI(data) {
    const container = document.getElementById('forecastContainer');
    const grid = document.getElementById('forecastGrid');
    container.classList.remove('hidden');
    grid.innerHTML = '';

    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const dateStr = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        
        const card = `
            <div class="glass-card p-4 rounded-xl text-center hover:-translate-y-1 transition-transform duration-300">
                <p class="font-bold text-lg text-white mb-1">${dateStr}</p>
                <div class="bg-white/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center my-3 shadow-inner">
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon" class="w-14 h-14 drop-shadow-md">
                </div>
                <div class="space-y-2 text-sm font-medium text-white/90">
                    <p class="bg-white/10 py-1 rounded"><i class="fa-solid fa-temperature-half text-orange-300"></i> ${Math.round(day.main.temp)}°C</p>
                    <p class="bg-white/10 py-1 rounded"><i class="fa-solid fa-wind text-blue-200"></i> ${day.wind.speed} m/s</p>
                    <p class="bg-white/10 py-1 rounded"><i class="fa-solid fa-droplet text-blue-300"></i> ${day.main.humidity}%</p>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function saveRecentSearch(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!cities.includes(city)) {
        cities.unshift(city);
        if (cities.length > 5) cities.pop();
        localStorage.setItem('recentCities', JSON.stringify(cities));
    }
    loadRecentSearches();
}

function loadRecentSearches() {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (cities.length > 0) {
        recentBox.classList.remove('hidden');
        recentDrop.innerHTML = '<option value="" disabled selected>Select from history...</option>';
        cities.forEach(city => {
            recentDrop.innerHTML += `<option value="${city}">${city}</option>`;
        });
    } else {
        recentBox.classList.add('hidden');
    }
}

function showError(msg) {
    errorBox.innerHTML = `<i class="fa-solid fa-circle-exclamation mr-2"></i> ${msg}`;
    errorBox.classList.remove('hidden');
    setTimeout(hideError, 5000);
}

function hideError() {
    errorBox.classList.add('hidden');
}