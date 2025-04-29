const city = document.getElementById('city');
const searchBtn = document.getElementById("searchBtn");
const errorMsg = document.getElementById('error');
const hiddingMsg = document.getElementById('displayMsg');




const validateInput = () => {
    const inputCheck = city.value.trim();


    if (inputCheck === "") {

        errorMsg.innerText = "Please enter the city name";
        hiddingMsg.classList.add('hidden');

        return false;
    } else {
        errorMsg.innerText = "";
        hiddingMsg.classList.add('hidden');

        return true;
    }

};


const getForecastdetails = async () => {

    const apiKey = "9b6a11a9a1ba4bdd96055258250903";

    const weatherApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city.value}&days=3&aqi=yes&alerts=yes`;

    let weatherResponse = await fetch(weatherApi);
    console.log(weatherResponse);

    let weatherData = await weatherResponse.json();
    console.log(weatherData);

    const forecastDays = weatherData.forecast.forecastday;

    console.log("Forecast Data for 3 Days:", forecastDays);

    slidingCardUi(forecastDays);



};

const getCurrentWeather = async () => {
    const apiKey = "746e42802e4eac0e3c8fb2b8d0c42224";
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=metric`;

    let weatherResponse = await fetch(weatherApi);
    console.log(weatherResponse);

    let weatherData = await weatherResponse.json();
    console.log(weatherData);

    let timezoneOffset = weatherData.timezone;
    let time = updateLocalTime(timezoneOffset);


    const existingCard = document.querySelector(".upperCard");
    if (existingCard) {
        existingCard.remove();
    }
    upperCardUi(weatherData, time);

    await getForecastdetails();


    lowerCardUi(weatherData, time);


};

const updateLocalTime = (timezoneOffset) => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + timezoneOffset * 1000);

    let hours = cityTime.getHours();
    const minutes = cityTime.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
};

const upperCardUi = (weatherData, time) => {
    let upperCard = document.createElement('div');
    upperCard.classList.add('upperCard');

    let description = weatherData.weather[0].description.toUpperCase();
    let visibility = weatherData.visibility / 1000;


    upperCard.innerHTML = `
            <p class="time">${time}</p>
            <p class="visibility">${visibility}km</p>
            <p class="cityName"> ${city.value.toUpperCase()} </p>
            <p class="temperature">${Math.round(weatherData.main.temp)}°C</p>
            <p class="condition">${description}</p>
            <div class="minMax">
                <p class="minTem"><span id="min">min</span> <br>${Math.round(weatherData.main.temp_min)}°C</p>
                <span>|</span>
                <p class="maxtem"><span id="max">max</span> <br>${Math.round(weatherData.main.temp_max)}°C</p>
            </div>
            `;


    let container = document.querySelector('.container');
    container.appendChild(upperCard);



};

const lowerCardUi = (weatherData, time) => {

    const existingCard = document.querySelector(".lowerCard");
    if (existingCard) {
        existingCard.remove();
    }

    let lowerCard = document.createElement('div');
    lowerCard.classList.add('lowerCard');


    lowerCard.innerHTML = `
            <p class="feelsLike">${weatherData.main.feels_like}</p>
            <p class="wind">${weatherData.wind.speed}m/s</p>
            <p class="rain">precipition(3hr):</p>
            <p class="humidity">${weatherData.main.humidity}</p>
    `;

    let container = document.querySelector('.container');
    container.appendChild(lowerCard);
};

const slidingCardUi =(forecastDays) =>{
    const existingCard = document.querySelector(".slidingDetails");
    if (existingCard) {
        existingCard.remove();
    }

    const slidingDetails = document.createElement('div');
    slidingDetails.classList.add('slidingDetails');

    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleString('en', { weekday: 'long' });
        const dayTime = `${dayName}, ${date.toLocaleDateString()}`;

        slidingDetails.innerHTML += `
        <div class="forecastBlock">
            <p class="forecastDate">${dayTime}</p>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="weather-icon">
            <p class="forecastTemp">${Math.round(day.day.avgtemp_c)}°C</p>
            <p class="forecastCondition">${day.day.condition.text}</p>
            <p class="forecastHumidity">Humidity: ${day.day.avghumidity}%</p>
            <p class="forecastwind">Wind: ${day.day.maxwind_kph} km/h</p>
        </div>
    `;
    });

    let container = document.querySelector('.container');
    container.appendChild(slidingDetails);
    


};






searchBtn.addEventListener("click", () => {
    if (validateInput()) {
        getCurrentWeather();

    }
});




