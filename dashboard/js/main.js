// js/main.js — FINAL FIX WITH DEBUGGING
import { setData, render } from './ui.js';
import { initWeather } from './js/weather.js';
import { updateDateTime } from './js/calendar.js';

let data = [];

// Debug logger
function log(msg) {
  console.log(`%c[MAIN] ${msg}`, 'color: lime; background: black; padding: 2px 6px; border-radius: 4px;');
  const debug = document.getElementById('debug');
  if (debug) debug.textContent = msg;
}

// Create debug div if not exists
if (!document.getElementById('debug')) {
  const d = document.createElement('div');
  d.id = 'debug';
  d.style.cssText = 'position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.9);color:lime;padding:10px;font:12px monospace;z-index:99999;border-radius:8px;max-width:400px;';
  document.body.appendChild(d);
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

// FINAL FIX: Run everything AFTER DOM is ready — MULTIPLE TIMES if needed
function startApp() {
  log('startApp() called');

  // Force hide popups
  document.getElementById('calendar-popup')?.classList.remove('show');
  document.getElementById('forecast-popup')?.classList.remove('show');

  // Update date/time
  if (typeof updateDateTime === 'function') {
    updateDateTime();
    log('updateDateTime() ran');
  } else {
    log('updateDateTime not ready yet');
  }

  // Update weather
  if (typeof initWeather === 'function') {
    initWeather();
    log('initWeather() ran');
  } else {
    log('initWeather not ready yet');
  }

  // Keep trying every 100ms until both are ready
  if (typeof updateDateTime !== 'function' || typeof initWeather !== 'function') {
    setTimeout(startApp, 100);
  }
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  log('DOM loaded — starting app...');
  loadData().then(() => {
    startApp();
    setInterval(updateDateTime, 60000);
  });
});

// Also run immediately in case modules loaded early
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  log('Document already ready — running startApp now');
  startApp();
}
