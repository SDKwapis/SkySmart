const cityInput = document.querySelector("#srchbttn");
const cityName = document.querySelector("#searchCity");

const cityList = JSON.parse(localStorage.getItem("City")) || [];

// Display searched city buttons
function displayCityButtons() {
  const cityButtonList = document.getElementById("cityButtons");
  cityButtonList.innerHTML = "";
  cityList.forEach((city) => {
    const bttn = document.createElement("button");
    bttn.classList.add("city");
    bttn.innerHTML = city;
    cityButtonList.appendChild(bttn);
  });
}

// Fetch and display weather data
function fetchAndDisplayWeather(cityValue) {
  const dataExist = document.getElementById("weatherDisplay");
  dataExist.innerHTML = "";
  const fiveDayExist = document.getElementById("FiveDayForecast");
  fiveDayExist.innerHTML = "";
  const apiKey = "f63ca6bf62c5c8783f6c0a4d9033f7ec";
  const geoCode = `https://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=1&appid=${apiKey}`;

  fetch(geoCode)
    .then((res) => res.json())
    .then((data) => {
      const [{ lat, lon }] = data;
      const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          const {
            current: { temp, dt, humidity, wind_speed },
            daily} = data;
            const { id } = data.current.weather[0];
          // console.log(id);
          console.log(data);
          const cityDate = new Date(dt * 1000).toLocaleDateString();
          const cityTitle = document.getElementById("weatherDisplay");
          const cityDisplay = document.createElement("h2");
          const cityTemp = document.createElement("p");
          const cityWind = document.createElement("p");
          const cityHum = document.createElement("p");

          cityDisplay.innerHTML = `${cityValue} ${cityDate} ${getEmoji(id)}`;
          cityTemp.innerHTML = `Temp: ${Math.round(temp * 1.8) + 32}\u00B0F`;
          cityWind.innerHTML = `Wind: ${wind_speed} mph`;
          cityHum.innerHTML = `Humidity: ${humidity}%`;
          cityTitle.appendChild(cityDisplay);
          cityTitle.appendChild(cityTemp);
          cityTitle.appendChild(cityWind);
          cityTitle.appendChild(cityHum);

          for (let i = 1; i <= 5; i++) {
            const day = daily[i];
            const forecastDate = new Date(day.dt * 1000).toLocaleDateString();
            const forecastEmoji = day.weather[0].id;
            const forecastTemp = Math.round(day.temp.day);
            const forecastWind = day.wind_speed;
            const forecastHum = day.humidity;

            const fiveDayDiv = document.createElement("div");
            fiveDayDiv.classList.add("forecastDay");

            const fiveDayDisplay = document.createElement("h4");
            const fiveDayTemp = document.createElement("p");
            const fiveDayWind = document.createElement("p");
            const fiveDayHum = document.createElement("p");

            fiveDayDisplay.innerHTML = `${forecastDate} ${getEmoji(forecastEmoji)}`;

            fiveDayTemp.innerHTML = `Temp: ${Math.round(forecastTemp * 1.8) + 32}\u00B0F`;
            fiveDayWind.innerHTML = `Wind: ${forecastWind} mph`;
            fiveDayHum.innerHTML = `Humidity: ${forecastHum}%`;

            fiveDayDiv.appendChild(fiveDayDisplay);
            fiveDayDiv.appendChild(fiveDayTemp);
            fiveDayDiv.appendChild(fiveDayWind);
            fiveDayDiv.appendChild(fiveDayHum);

            fiveDayExist.appendChild(fiveDayDiv);
          }
        });
    });
}

// Initial loading of cities from local storage
document.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault();
  displayCityButtons();
});

// Search for a city button - adds new cities to the searched cities list and stores them in local storage
cityInput.addEventListener("click", function (event) {
  event.preventDefault();
  const cityValue = cityName.value.trim();
  if (cityValue === "") {
    alert("Please enter a city name");
  } else if (!cityList.includes(cityValue)) {
    cityList.push(cityValue);
    localStorage.setItem("City", JSON.stringify(cityList));
    displayCityButtons();
    fetchAndDisplayWeather(cityValue);
    cityName.value = "";
  }
});

// Makes city list buttons clickable
document
  .getElementById("cityButtons")
  .addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
      const cityValue = event.target.textContent;
      fetchAndDisplayWeather(cityValue);
    }
  });


  function getEmoji(id) {
    if (id >= 200 && id < 300){
      return "⛈️";
    } else if (id >= 300 && id < 400){
      return "🌧️";
    } else if (id >= 500 && id < 600){
      return "🌧️";
    } else if (id >= 600 && id < 700){
      return "❄️";
    } else if (id >= 700 && id < 800){
      return "🌫️";
    } else if (id === 800){
      return "☀️";
    } else if (id >= 801 && id < 810){
      return "☁️";
    } else {
      return "?";
    }
  };


