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

