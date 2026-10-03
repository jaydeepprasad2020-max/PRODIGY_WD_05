/* =========================================
   ELEMENTS
========================================= */

const searchForm =
    document.getElementById("searchForm");

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const locationBtn =
    document.getElementById("locationBtn");

const statusMessage =
    document.getElementById("status");

const weatherCard =
    document.getElementById("weatherCard");


/* Weather information elements */

const locationName =
    document.getElementById("locationName");

const localTime =
    document.getElementById("localTime");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const weatherDescription =
    document.getElementById("weatherDescription");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const precipitation =
    document.getElementById("precipitation");

const pressure =
    document.getElementById("pressure");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const timezone =
    document.getElementById("timezone");


/* =========================================
   WEATHER CODE MAP
========================================= */

const weatherCodes = {

    0: {
        description: "Clear Sky",
        icon: "☀️"
    },

    1: {
        description: "Mainly Clear",
        icon: "🌤️"
    },

    2: {
        description: "Partly Cloudy",
        icon: "⛅"
    },

    3: {
        description: "Overcast",
        icon: "☁️"
    },

    45: {
        description: "Fog",
        icon: "🌫️"
    },

    48: {
        description: "Rime Fog",
        icon: "🌫️"
    },

    51: {
        description: "Light Drizzle",
        icon: "🌦️"
    },

    53: {
        description: "Moderate Drizzle",
        icon: "🌦️"
    },

    55: {
        description: "Dense Drizzle",
        icon: "🌧️"
    },

    56: {
        description: "Light Freezing Drizzle",
        icon: "🌧️"
    },

    57: {
        description: "Dense Freezing Drizzle",
        icon: "🌧️"
    },

    61: {
        description: "Slight Rain",
        icon: "🌦️"
    },

    63: {
        description: "Moderate Rain",
        icon: "🌧️"
    },

    65: {
        description: "Heavy Rain",
        icon: "🌧️"
    },

    66: {
        description: "Light Freezing Rain",
        icon: "🌧️"
    },

    67: {
        description: "Heavy Freezing Rain",
        icon: "🌧️"
    },

    71: {
        description: "Slight Snow Fall",
        icon: "🌨️"
    },

    73: {
        description: "Moderate Snow Fall",
        icon: "🌨️"
    },

    75: {
        description: "Heavy Snow Fall",
        icon: "❄️"
    },

    77: {
        description: "Snow Grains",
        icon: "❄️"
    },

    80: {
        description: "Slight Rain Showers",
        icon: "🌦️"
    },

    81: {
        description: "Moderate Rain Showers",
        icon: "🌧️"
    },

    82: {
        description: "Violent Rain Showers",
        icon: "⛈️"
    },

    85: {
        description: "Slight Snow Showers",
        icon: "🌨️"
    },

    86: {
        description: "Heavy Snow Showers",
        icon: "❄️"
    },

    95: {
        description: "Thunderstorm",
        icon: "⛈️"
    },

    96: {
        description: "Thunderstorm with Hail",
        icon: "⛈️"
    },

    99: {
        description: "Thunderstorm with Heavy Hail",
        icon: "⛈️"
    }

};


/* =========================================
   STATUS FUNCTION
========================================= */

function showStatus(
    message,
    type = ""
) {

    statusMessage.textContent =
        message;

    statusMessage.className =
        "status";

    if (type) {

        statusMessage.classList.add(
            type
        );

    }

}


/* =========================================
   LOADING STATE
========================================= */

function setLoading(
    isLoading
) {

    searchBtn.disabled =
        isLoading;

    locationBtn.disabled =
        isLoading;

    if (isLoading) {

        searchBtn.textContent =
            "Loading...";

    } else {

        searchBtn.textContent =
            "Search";

    }

}


/* =========================================
   SEARCH EVENT
========================================= */

searchForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        if (!city) {

            showStatus(
                "Please enter a city name.",
                "error"
            );

            cityInput.focus();

            return;

        }


        setLoading(true);


        showStatus(
            "Searching for the location..."
        );


        try {

            const location =
                await searchLocation(city);


            if (!location) {

                throw new Error(
                    "Location not found."
                );

            }


            await getWeather(
                location.latitude,
                location.longitude,
                location.name,
                location.country
            );


            localStorage.setItem(
                "lastCity",
                city
            );


        } catch (error) {

            console.error(
                error
            );


            weatherCard.classList.add(
                "hidden"
            );


            showStatus(
                "Location not found. Please try another city.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }
);


/* =========================================
   SEARCH LOCATION
   Open-Meteo Geocoding API
========================================= */

async function searchLocation(
    city
) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Geocoding request failed."
        );

    }


    const data =
        await response.json();


    if (
        !data.results ||
        data.results.length === 0
    ) {

        return null;

    }


    return data.results[0];

}


/* =========================================
   GET WEATHER
========================================= */

async function getWeather(
    latitude,
    longitude,
    cityName,
    country = ""
) {

    showStatus(
        "Loading weather information..."
    );


    try {

        const weatherURL =
            "https://api.open-meteo.com/v1/forecast";


        const url =
            new URL(weatherURL);


        url.searchParams.set(
            "latitude",
            latitude
        );

        url.searchParams.set(
            "longitude",
            longitude
        );


        url.searchParams.set(
            "current",
            [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "is_day",
                "precipitation",
                "weather_code",
                "wind_speed_10m",
                "surface_pressure"
            ].join(",")
        );


        url.searchParams.set(
            "daily",
            "sunrise,sunset"
        );


        url.searchParams.set(
            "timezone",
            "auto"
        );


        url.searchParams.set(
            "forecast_days",
            "1"
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Weather request failed."
            );

        }


        const data =
            await response.json();


        displayWeather(
            data,
            cityName,
            country
        );


        showStatus(
            "Weather updated successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            error
        );


        weatherCard.classList.add(
            "hidden"
        );


        showStatus(
            "Unable to load weather data. Please try again.",
            "error"
        );

        throw error;

    }

}


/* =========================================
   DISPLAY WEATHER
========================================= */

function displayWeather(
    data,
    cityName,
    country
) {

    const current =
        data.current;


    const daily =
        data.daily;


    const weatherInfo =
        weatherCodes[
        current.weather_code
        ] ||
        {
            description:
                "Unknown Weather",

            icon:
                "🌤️"
        };


    /* Location */

    let fullLocation =
        cityName ||
        "Your Location";


    if (
        country &&
        cityName &&
        country !== cityName
    ) {

        fullLocation +=
            `, ${country}`;

    }


    locationName.textContent =
        fullLocation;


    /* Temperature */

    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    /* Weather description */

    weatherDescription.textContent =
        weatherInfo.description;


    /* Weather icon */

    weatherIcon.textContent =
        weatherInfo.icon;


    /* Feels like */

    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )} °C`;


    /* Humidity */

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    /* Wind */

    windSpeed.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* Precipitation */

    precipitation.textContent =
        `${current.precipitation} mm`;


    /* Pressure */

    pressure.textContent =
        `${Math.round(
            current.surface_pressure
        )} hPa`;


    /* Sunrise */

    if (
        daily &&
        daily.sunrise &&
        daily.sunrise.length > 0
    ) {

        sunrise.textContent =
            formatTime(
                daily.sunrise[0]
            );

    } else {

        sunrise.textContent =
            "--";

    }


    /* Sunset */

    if (
        daily &&
        daily.sunset &&
        daily.sunset.length > 0
    ) {

        sunset.textContent =
            formatTime(
                daily.sunset[0]
            );

    } else {

        sunset.textContent =
            "--";

    }


    /* Timezone */

    timezone.textContent =
        data.timezone ||
        "--";


    /* Local time */

    localTime.textContent =
        `Local time: ${formatDateTime(
            current.time
        )}`;


    /* Show card */

    weatherCard.classList.remove(
        "hidden"
    );

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(
    dateTime
) {

    if (!dateTime) {

        return "--";

    }


    const parts =
        dateTime.split("T");


    if (
        parts.length < 2
    ) {

        return dateTime;

    }


    const time =
        parts[1];


    const [
        hours,
        minutes
    ] =
        time.split(":");


    const hour =
        parseInt(
            hours,
            10
        );


    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    const displayHour =
        hour % 12 || 12;


    return `${displayHour}:${minutes} ${suffix}`;

}


/* =========================================
   FORMAT DATE AND TIME
========================================= */

function formatDateTime(
    dateTime
) {

    if (!dateTime) {

        return "--";

    }


    const parts =
        dateTime.split("T");


    if (
        parts.length < 2
    ) {

        return dateTime;

    }


    const date =
        parts[0];

    const time =
        formatTime(dateTime);


    return `${date} • ${time}`;

}


/* =========================================
   CURRENT LOCATION BUTTON
========================================= */

locationBtn.addEventListener(
    "click",
    function () {

        if (
            !navigator.geolocation
        ) {

            showStatus(
                "Geolocation is not supported by your browser.",
                "error"
            );

            return;

        }


        showStatus(
            "Getting your location..."
        );


        setLoading(true);


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                getWeatherByCoordinates(
                    latitude,
                    longitude
                )
                    .finally(
                        function () {

                            setLoading(
                                false
                            );

                        }
                    );

            },


            function (error) {

                console.error(
                    error
                );


                setLoading(
                    false
                );


                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {

                    showStatus(
                        "Location permission was denied. Please allow location access or search for a city.",
                        "error"
                    );

                } else if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {

                    showStatus(
                        "Your location is currently unavailable.",
                        "error"
                    );

                } else if (
                    error.code ===
                    error.TIMEOUT
                ) {

                    showStatus(
                        "Location request timed out. Please try again.",
                        "error"
                    );

                } else {

                    showStatus(
                        "Unable to access your location.",
                        "error"
                    );

                }

            },

            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 300000

            }

        );

    }
);


/* =========================================
   WEATHER USING CURRENT COORDINATES
========================================= */

async function getWeatherByCoordinates(
    latitude,
    longitude
) {

    showStatus(
        "Loading your weather..."
    );


    try {

        /*
         * We intentionally do NOT depend on
         * reverse geocoding here.
         *
         * The weather API accepts latitude
         * and longitude directly.
         */

        await getWeather(
            latitude,
            longitude,
            "Your Location",
            ""
        );


    } catch (error) {

        console.error(
            error
        );


        showStatus(
            "Unable to load weather for your current location.",
            "error"
        );

    }

}


/* =========================================
   LOAD LAST SEARCHED CITY
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    async function () {

        const lastCity =
            localStorage.getItem(
                "lastCity"
            );


        if (!lastCity) {

            return;

        }


        cityInput.value =
            lastCity;


        try {

            setLoading(true);


            const location =
                await searchLocation(
                    lastCity
                );


            if (location) {

                await getWeather(
                    location.latitude,
                    location.longitude,
                    location.name,
                    location.country
                );

            }


        } catch (error) {

            console.error(
                "Unable to load previous location:",
                error
            );

        } finally {

            setLoading(false);

        }

    }
);