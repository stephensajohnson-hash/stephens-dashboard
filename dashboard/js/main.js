import { render, setData } from './ui.js';
import { updateDateTime } from './calendar.js';
import { initWeather } from './weather.js';

let data = [];

async function loadData() {
  try {
    const res = await fetch('data.json?v=' + Date.now());
    if (res.ok) data = await res.json();
  } catch(e) {}
  if (!data.length) {
    const saved = localStorage.getItem('dashboardData');
    data = saved ? JSON.parse(saved) : [];
  } else {
    localStorage.setItem('dashboardData', JSON.stringify(data));
  }
  setData(data);
  render();
}

window.publishData = () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'data.json'; a.click();
  URL.revokeObjectURL(url);
  alert('Data downloaded! Upload to GitHub to redeploy.');
};

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateDateTime();
  setInterval(updateDateTime, 60000);
  initWeather();
});
