export const icons = { /* your full icons object — paste here */ };

export const weatherMap = {0:"sunny",1:"sunny",2:"partly",3:"cloudy",45:"fog",48:"fog",51:"drizzle",53:"drizzle",55:"drizzle",61:"rain",63:"rain",65:"rain",71:"snow",73:"snow",75:"snow",77:"snow",95:"storm",96:"storm",99:"storm"};

export function getIcon(c) { return icons[weatherMap[c] || "cloudy"]; }

export function initWeather() {
  fetch('https://api.open-meteo.com/v1/forecast?latitude=33.75&longitude=-84.39&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=America%2FNew_York')
    .then(r => r.json())
    .then(w => {
      document.getElementById('weather-temp').textContent = Math.round(w.current.temperature_2m) + '°';
      document.getElementById('weather-icon-svg').innerHTML = getIcon(w.current.weathercode);

      let forecast = '<div class="font-bold mb-3 text-center">7-Day Forecast</div>';
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(); date.setDate(today.getDate() + i);
        const name = i === 0 ? 'Today' : date.toLocaleDateString('en-US', {weekday:'short'});
        const high = Math.round(w.daily.temperature_2m_max[i]);
        const low = Math.round(w.daily.temperature_2m_min[i]);
        const icon = getIcon(w.daily.weathercode[i]);
        forecast += `<div class="flex items-center justify-between py-1.5 ${i===0?'font-bold':''}">
          <span class="w-16">${name}</span>
          <span class="forecast-svg inline-block mr-3">${icon}</span>
          <span>${low}°–${high}°</span>
        </div>`;
      }
      document.getElementById('forecast-popup').innerHTML = forecast;
    });

  const wp = document.querySelector('#weather-link')?.parentElement;
  wp?.addEventListener('mouseenter', () => document.getElementById('forecast-popup').classList.add('show'));
  wp?.addEventListener('mouseleave', () => document.getElementById('forecast-popup').classList.remove('show'));
}
