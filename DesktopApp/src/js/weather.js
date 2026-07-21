// Weather page initialization
export default function initWeather() {
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-weather-btn');
  const weatherCard = document.getElementById('weather-card');

  // Static weather data as the backend is removed
  const staticWeatherData = {
    name: 'San Francisco',
    main: { temp: 18, humidity: 72 },
    weather: [{ description: 'partly cloudy' }],
    wind: { speed: 4.5 }
  };

  // Display static weather data on load
  displayWeather(staticWeatherData);

  // The search button will now just re-display the static data
  searchBtn.addEventListener('click', () => {
    displayWeather(staticWeatherData);
  });

  // Set default city input value
  cityInput.value = staticWeatherData.name;
}

function displayWeather(data) {
  const weatherCard = document.getElementById('weather-card');
  
  if (data.error) {
    weatherCard.innerHTML = `<p class="error">${data.error}</p>`;
    return;
  }

  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  
  weatherCard.innerHTML = `
    <div class="weather-info">
      <h2>${data.name}</h2>
      <div class="temperature">${temp}°C</div>
      <div class="description">${description}</div>
      <div class="details">
        <div>Humidity: ${data.main.humidity}%</div>
        <div>Wind: ${data.wind.speed} m/s</div>
      </div>
    </div>
  `;
}