export const icons = {
  sunny: `<svg viewBox="0 0 64 64" fill="#fbbf24"><circle cx="32" cy="32" r="14"/><line x1="32" y1="8" x2="32" y2="4" stroke="#fbbf24" stroke-width="6"/><line x1="32" y1="60" x2="32" y2="56"/><line x1="8" y1="32" x2="4" y2="32"/><line x1="60" y1="32" x2="56" y2="32"/><line x1="14" y1="14" x2="10" y2="10"/><line x1="50" y1="50" x2="54" y2="54"/><line x1="14" y1="50" x2="10" y2="54"/><line x1="50" y1="14" x2="54" y2="10"/></svg>`,
  partly: `<svg viewBox="0 0 64 64"><circle cx="40" cy="28" r="12" fill="#fbbf24"/><path d="M12 30 H30 M12 24 H26 M38 30 H56 M42 24 H56" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/></svg>`,
  cloudy: `<svg viewBox="0 0 64 64"><path d="M16 38 A18 18 0 1 1 48 38 Q48 48 38 48 H16 Q6 48 6 38 Q6 28 16 28 Q20 20 32 20 Q42 20 48 28" fill="#94a3b8"/></svg>`,
  drizzle: `<svg viewBox="0 0 64 64"><path d="M16 38 A18 18 0 1 1 48 38 Q48 48 38 48 H16 Q6 48 6 38 Q6 28 16 28 Q20 20 32 20 Q42 20 48 28" fill="#94a3b8"/><circle cx="18" cy="50" r="2" fill="#60a5fa"/><circle cx="28" cy="56" r="2" fill="#60a5fa"/><circle cx="38" cy="50" r="2" fill="#60a5fa"/><circle cx="48" cy="56" r="2" fill="#60a5fa"/></svg>`,
  rain: `<svg viewBox="0 0 64 64"><path d="M16 38 A18 18 0 1 1 48 38 Q48 48 38 48 H16 Q6 48 6 38 Q6 28 16 28 Q20 20 32 20 Q42 20 48 28" fill="#94a3b8"/><line x1="18" y1="48" x2="16" y2="58" stroke="#60a5fa" stroke-width="4" stroke-linecap="round"/><line x1="28" y1="52" x2="26" y2="62"/><line x1="38" y1="48" x2="36" y2="58"/><line x1="48" y1="52" x2="46" y2="62"/></svg>`,
  snow: `<svg viewBox="0 0 64 64"><path d="M16 38 A18 18 0 1 1 48 38 Q48 48 38 48 H16 Q6 48 6 38 Q6 28 16 28 Q20 20 32 20 Q42 20 48 28" fill="#94a3b8"/><circle cx="20" cy="48" r="4" fill="white"/><circle cx="32" cy="54" r="4" fill="white"/><circle cx="44" cy="48" r="4" fill="white"/></svg>`,
  storm: `<svg viewBox="0 0 64 64"><path d="M16 38 A18 18 0 1 1 48 38 Q48 48 38 48 H16 Q6 48 6 38 Q6 28 16 28 Q20 20 32 20 Q42 20 48 28" fill="#64748b"/><polyline points="24,48 20,58 30,54 26,64" fill="none" stroke="#fbbf24" stroke-width="4"/><polyline points="40,52 36,62 46,58 42,68" fill="none" stroke="#fbbf24" stroke-width="4"/></svg>`,
  fog: `<svg viewBox="0 0 64 64"><rect x="6" y="28" width="52" height="8" rx="4" fill="#cbd5e1"/><rect x="6" y="38" width="52" height="8" rx="4" fill="#cbd5e1"/><rect x="6" y="48" width="52" height="8" rx="4" fill="#cbd5e1"/></svg>`
};

export const weatherMap = {0:"sunny",1:"sunny",2:"partly",3:"cloudy",45:"fog",48:"fog",51:"drizzle",53:"drizzle",55:"drizzle",61:"rain",63:"rain",65:"rain",71:"snow",73:"snow",75:"snow",77:"snow",95:"storm",96:"storm",99:"storm"};

export function getIcon(c) {
  return icons[weatherMap[c] || "cloudy"];
}

export function initWeather() {
  const tempEl = document.getElementById('weather-temp');
  const iconEl = document.getElementById('weather-icon-svg');
  const forecastEl = document.getElementById('forecast-popup');
  const weatherLink = document.querySelector('#weather-link')?.parentElement;

  if (!tempEl || !iconEl || !forecastEl) return;

  fetch('https://api.open-meteo.com/v1/forecast?latitude=33.75&longitude=-84.39&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=America%2FNew_York')
    .then(r => r.json())
    .then(w => {
      tempEl.textContent = Math.round(w.current.temperature_2m) + '°';
      iconEl.innerHTML = getIcon(w.current.weathercode);

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
      forecastEl.innerHTML = forecast;
    });

  if (weatherLink) {
    weatherLink.addEventListener('mouseenter', () => forecastEl.classList.add('show'));
    weatherLink.addEventListener('mouseleave', () => forecastEl.classList.remove('show'));
  }
}
