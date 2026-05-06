# Weather-web

A responsive, feature-rich weather forecasting application built with Vanilla JavaScript and Tailwind CSS. This application interacts with the OpenWeatherMap API to provide real-time weather conditions and a 5-day extended forecast based on user searches or current geolocation.

## Features Implemented

* **Real-Time Data Fetching:** Retrieves current weather data including temperature, humidity, wind speed, and dynamic weather icons.
* **Geolocation Support:** Users can fetch weather data for their exact current location using the browser's Geolocation API.
* **5-Day Extended Forecast:** Displays a clean, grid-based 5-day forecast organized by dates.
* **Recent Searches (Local Storage):** Automatically saves recent successful searches and populates them in a dropdown menu for quick access.
* **Temperature Unit Toggle:** Seamlessly switch between Celsius (°C) and Fahrenheit (°F) for current weather data.
* **Custom Alerts & Error Handling:** * Extreme heat alerts trigger automatically if the temperature exceeds 40°C.
    * Graceful, custom UI error messages replace native `alert()` boxes for invalid cities or API failures.
* **Glassmorphism UI:** A sleek, modern, and highly responsive user interface optimized for Desktop, iPad, and Mobile screens using Tailwind CSS.

## Tech Stack

* **Frontend:** HTML5, Tailwind CSS (CLI)
* **Logic & DOM Manipulation:** Vanilla JavaScript (ES6+)
* **Icons:** FontAwesome & OpenWeatherMap standard icons
* **Data Source:** OpenWeatherMap API (`fetch` / Async-Await)

## Usage Guide

* Type any city name into the search bar and click **Search City**.
* Click **Current Location** to allow the browser to detect and show weather for your area.
* Use the **Select a history...** dropdown to quickly revisit up to 5 previously searched cities.
* Click **Switch to °F / °C** on the main weather card to toggle temperature units.
## GitHub Link 
* `https://github.com/jainarchit17/Weather-web`