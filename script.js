// Replace YOUR_API_KEY with the API key from your OpenWeatherMap account.
const API_KEY = "YOUR_API_KEY";
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    weatherCard.hidden = true;
    message.textContent = "Please enter a city name before searching.";
    cityInput.focus();
    return;
  }

  message.textContent = "Loading weather...";
  weatherCard.hidden = true;
  searchButton.disabled = true;

  try {
    const parameters = new URLSearchParams({
      q: city,
      appid: API_KEY,
      units: "metric"
    });
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${parameters}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Check the spelling and try again.");
      }
      if (response.status === 401) {
        throw new Error("The API key is missing or invalid. Add your OpenWeatherMap API key in script.js.");
      }
      throw new Error("Weather data could not be loaded. Please try again later.");
    }

    const data = await response.json();
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent =
      `${Math.round(data.main.temp)} °C`;
    document.getElementById("humidity").textContent =
      `${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent =
      `${data.wind.speed} m/s`;
    document.getElementById("condition").textContent =
      data.weather[0].description;

    const icon = document.getElementById("weatherIcon");
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    icon.alt = data.weather[0].description;

    message.textContent = "";
    weatherCard.hidden = false;
  } catch (error) {
    message.textContent = error instanceof TypeError
      ? "Could not connect to the weather service. Check your internet connection and try again."
      : error.message;
  } finally {
    searchButton.disabled = false;
  }
});
