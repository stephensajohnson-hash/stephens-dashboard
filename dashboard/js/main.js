import { setData, render } from './ui.js';
import { updateDateTime } from './calendar.js';
import { initWeather } from './weather.js';

let data = [];

export async function loadData() {
  try {
    const res = await fetch('data.json?t=' + Date.now());
    if (res.ok) data = await res.json();
  } catch (e) {}
  if (!data.length) {
    const saved = localStorage.getItem('dashboardData');
    data = saved ? JSON.parse(saved) : [];
  } else {
    localStorage.setItem('dashboardData', JSON.stringify(data));
  }
  setData(data);
  render();
}

export function publishData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
  alert('data.json downloaded! Upload to GitHub → redeploy');
}

// js/main.js — ONLY CHANGE THIS PART
document.addEventListener('DOMContentLoaded', () => {
  loadData().then(() => {
    render();
    updateDateTime();
    setInterval(updateDateTime, 60000);
    initWeather();
  });
});

