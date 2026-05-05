const API = "092fc96f5f422e4108b224c4f25d85cd";
let isCelsius = true;
let currentWeatherData = null;

// DOM Elements
const cityInput=document.getElementById('cityInput');
const searchBtn=document.getElementById('searchBtn');
const currentLocationBtn=document.getElementById('currentBtn');
const errorBox=document.getElementById('errBox');
const recentSearchesContainer=document.getElementById('recents');
const recentDrop=document.getElementById('recentDrop');
const mainBody=document.getElementById('mainBody');

document.addEventListener('DOMContentLoaded', loadRecentSearches);
searchBtn.addEventListener('click',()=>{
    const city=cityInput.value.trim();
    if(!city) return showError("Please enter a valid city name before searching.");
    fetchWeatherByCity(city);
});

currentLocationBtn.addEventListener('click',()=>{
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
    if(city) fetchWeatherByCity(city);
});

document.getElementById('toggleUnitBtn').addEventListener('click',()=>{
    isCelsius = !isCelsius;
    if(currentWeatherData) updateCurrentWeatherUI(currentWeatherData);
});

async function fetchWeatherByCity(city){
    hideError();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);
        if(!response.ok) throw new Error("City not found. Please check the spelling and try again.");
        const data = await response.json();
        saveRecentSearch(data.name);
        updateCurrentWeatherUI(data);
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
        updateCurrentWeatherUI(data);
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
        recentSearchesContainer.classList.remove('hidden');
        recentDrop.innerHTML = '<option value="" disabled selected>Select from history...</option>';
        cities.forEach(city => {
            recentDrop.innerHTML += `<option value="${city}">${city}</option>`;
        });
    } else {
        recentSearchesContainer.classList.add('hidden');
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