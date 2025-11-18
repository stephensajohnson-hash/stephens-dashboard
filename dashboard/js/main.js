// js/main.js — FINAL FIXED VERSION
import { setData, render } from './ui.js';
import { updateDateTime } from './calendar.js';
import { initWeather } from './weather.js';

let data = [];  // ← only declared once

// Debug logger
function log(msg) {
  console.log(`%c[MAIN] ${msg}`, 'color: lime; background: black; padding: 2px 6px; border-radius: 4px;');
  const debug = document.getElementById('debug');
  if (debug) debug.textContent = msg;
}

export async function loadData() {
  log('loadData() started');
  try {
    const res = await fetch('data.json?t=' + Date.now());
    if (res.ok) {
      data = await res.json();
      log('Loaded from data.json');
    }
  } catch (e) {
    log('data.json not found, using localStorage');
  }

  if (!data.length) {
    const saved = localStorage.getItem('dashboardData');
    data = saved ? JSON.parse(saved) : [];
    log(data.length ? 'Loaded from localStorage' : 'No saved data');
  } else {
    localStorage.setItem('dashboardData', JSON.stringify(data));
  }

  setData(data);
  render();
  log('Dashboard rendered');
}

export function publishData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
  log('data.json downloaded');
}

// Global for inline onclicks
window.publishData = publishData;

// Start app — bulletproof timing
function startApp() {
  log('startApp() called');

  // Hide popups
  document.getElementById('calendar-popup')?.classList.remove('show');
  document.getElementById('forecast-popup')?.classList.remove('show');

  // Date/Time
  if (typeof updateDateTime === 'function') {
    updateDateTime();
    log('updateDateTime() ran');
  }

  // Weather
  if (typeof initWeather === 'function') {
    initWeather();
    log('initWeather() ran');
  }

  // Retry if not ready
  if (typeof updateDateTime !== 'function' || typeof initWeather !== 'function') {
    setTimeout(startApp, 100);
  }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  log('DOM loaded');
  loadData().then(startApp);
  setInterval(() => {
    if (typeof updateDateTime === 'function') updateDateTime();
  }, 60000);
});

// Run immediately if already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  log('DOM already ready');
  loadData().then(startApp);
}
