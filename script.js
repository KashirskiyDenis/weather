'use strict';

let url = '';
let coords = null;

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const APP_ID = '';
const UNITS = 'metric';

const ICON_PATH = {
    '01d': 'images/weather/sun-b.png',
    '01n': 'images/weather/moon-and-stars.png',
    '02d': 'images/weather/partly-cloudy-day-b.png',
    '02n': 'images/weather/partly-cloudy-night-b.png',
    '03d': 'images/weather/clouds-b.png',
    '03n': 'images/weather/clouds-b.png',
    '04d': 'images/weather/clouds-b.png',
    '04n': 'images/weather/clouds-b.png',
    '09d': 'images/weather/rain-b.png',
    '09n': 'images/weather/rain-b.png',
    '10d': 'images/weather/rain-b.png',
    '10n': 'images/weather/rain-b.png',
    '11d': 'images/weather/cloud-lightning-b.png',
    '11n': 'images/weather/cloud-lightning-b.png',
    '13d': 'images/weather/snow.png',
    '13n': 'images/weather/snow.png',
    '50d': 'images/weather/haze-d.png',
    '50n': 'images/weather/fog.png',
};

const BACKGROUND_CLASS = {
    '01d': 'day black',
    '01n': 'night',
    '02d': 'clouds black',
    '02n': 'clouds-night black',
    '03d': 'clouds black',
    '03n': 'clouds-night black',
    '04d': 'clouds black',
    '04n': 'clouds-night black',
    '09d': 'rain black',
    '09n': 'rain black',
    '10d': 'rain black',
    '10n': 'rain black',
    '11d': 'lightning black',
    '11n': 'lightning black',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'day black',
    '50n': 'night',
};

// const WIND_DEG_TEXT = ['Северный', 'ССВ', 'Северо-восточный', 'ВСВ', 'Восточный', 'ВЮВ', 'Юго-восточный', 'ЮЮВ', 'Южный', 'ЮЮЗ', 'Юго-западный', 'ЗЮЗ', 'Западный', 'ЗСЗ', 'Северо-западный', 'ССЗ', 'Северный'];
const WIND_DEG_TEXT = ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ', 'С'];
//const BACKGROUND_SET = new Set(['01d', '01n', '09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n']);
const ENDING = new Set([2, 3, 4]);

function changeEnding(num, str) {
    num = Math.abs(num);
    num = num < 15 ? num : num % 10;
    if (num == 1)
        return str;
    else
        return ENDING.has(num) ? str + 'а' : str + 'ов';
}

const addZero = (num) => num < 10 ? '0' + num : num;

function changeUrl(q = '', lat, lon) {
    if (q != '')
        url = `${BASE_URL}weather?q=${q}&appid=${APP_ID}&units=${UNITS}&lang=ru`;
    else
        url = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=${UNITS}&lang=ru`;
}

async function updateWeather() {
    let response = await fetch(url);
    if (!response.ok) {
        alert('Город не найден.');
        return;
    }
    let weather = await response.json();
    console.log(weather);
    let date = new Date(weather.dt * 1000);

    titleCity.innerText = weather.name;

    updateDate.innerText = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    updateTime.innerText = `${date.getHours()}:${addZero(date.getMinutes())}`;

    temp.innerText = `${Math.round(weather.main.temp)}°C`;
    tempMax.innerText = `${Math.round(weather.main.temp_max)}°`;
    tempMin.innerText = `${Math.round(weather.main.temp_min)}°`;
    state.innerText = weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.substring(1);

    tempFeels.innerText = Math.round(weather.main.feels_like);
    tempFeelsUnit.innerText = changeEnding(Math.round(weather.main.feels_like), 'градус');
    pressure.innerText = Math.round(weather.main.pressure * 0.750062);
    humidity.innerText = weather.main.humidity;
    humidityUnit.innerText = changeEnding(weather.main.humidity, 'процент');
    windSpeed.innerText = weather.wind.speed;
    windDeg.innerText = weather.wind.deg;
    windDegUnit.innerText = changeEnding(weather.wind.deg, 'градус');
    windDegText.innerText = WIND_DEG_TEXT[Math.trunc(weather.wind.deg / 22.5)];

    date = new Date((weather.sys.sunrise - 14400 + weather.timezone) * 1000);
    sunrise.innerText = `${date.getHours()}:${addZero(date.getMinutes())}`;
    date = new Date((weather.sys.sunset - 14400 + weather.timezone) * 1000);
    sunset.innerText = `${date.getHours()}:${addZero(date.getMinutes())}`;

    changeIconWeather(weather.weather[0].icon, weather.weather[0].description);
    changeBackground(weather.weather[0].icon);
    changeIconsInterface(BACKGROUND_CLASS[weather.weather[0].icon]);
    changeShadowParameter(BACKGROUND_CLASS[weather.weather[0].icon]);
}

async function updateForecast() {

}

function changeIconsInterface(str) {
    if (str.includes('black')) {
        editIcon.src = 'images/edit-b.png'
        locationIcon.src = 'images/near-me-b.png'
        updateIcon.src = 'images/updates-b.png'
    } else {
        editIcon.src = 'images/edit.png'
        locationIcon.src = 'images/near-me.png'
        updateIcon.src = 'images/updates.png'
    }
}

function changeIconWeather(iconKey, description) {
    icon.src = ICON_PATH[iconKey];
    icon.alt = description;
}

function changeBackground(icon) {
    document.body.className = BACKGROUND_CLASS[icon];
    if (icon == '50d' || icon == '50n')
        container.classList.add('fog');
    else
        container.classList.remove('fog');
}

function changeShadowParameter(str) {
    let parameters = document.getElementsByClassName('parameter');
    if (str.includes('black')) {
        for (let parameter of parameters)
            parameter.classList.add('parameter-black');
    } else {
        for (let parameter of parameters)
            parameter.classList.remove('parameter-black');
    }
}

function changeCity() {
    let city = prompt('Введите название города', '');
    changeUrl(city);
    updateWeather();
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(
        pos => {
            coords = pos.coords;
            changeUrl('', coords.latitude.toFixed(2), coords.longitude.toFixed(2));
            updateWeather();
        },
        () => {
            alert('Не удаётся определить местоположение. Попробуйте ввести название города вручную.');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    let container = document.getElementById('container');

    let updateDate = document.getElementById('updateDate');
    let updateTime = document.getElementById('updateTime');
    let updateIcon = document.getElementById('updateIcon');

    let titleCity = document.getElementById('titleCity');
    let editIcon = document.getElementById('editIcon');
    let locationIcon = document.getElementById('locationIcon');

    let icon = document.getElementById('icon');
    let temp = document.getElementById('temp');
    let tempMax = document.getElementById('tempMax');
    let tempMin = document.getElementById('tempMin');
    let state = document.getElementById('state');

    let tempFeels = document.getElementById('tempFeels');
    let tempFeelsUnit = document.getElementById('tempFeelsUnit');
    let pressure = document.getElementById('pressure');
    let humidity = document.getElementById('humidity');
    let humidityUnit = document.getElementById('humidityUnit');
    let windSpeed = document.getElementById('windSpeed');
    let windDeg = document.getElementById('windDeg');
    let windDegUnit = document.getElementById('windDegUnit');
    let windDegText = document.getElementById('windDegText');
    let sunrise = document.getElementById('sunrise');
    let sunset = document.getElementById('sunset');

    updateIcon.addEventListener('click', updateWeather);

    editIcon.addEventListener('click', changeCity);
    locationIcon.addEventListener('click', getLocation);
});