import { toggleMenu } from './utils.js';
import { updateDateTime } from './calendar.js';
import { initWeather } from './weather.js';
import { setData, render } from './ui.js';
import { loadData, publishData } from './main.js';

let data = [];

// Debug logger
function log(msg) {
  console.log(`%c[MAIN] ${msg}`, 'color: lime; background: black; padding: 2px 6px; border-radius: 4px;');
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

// Global functions for inline onclicks
window.toggleMenu = toggleMenu;
window.publishData = publishData;
window.addGroup = () => window.ui?.addGroup();
window.addLink = () => window.ui?.addLink();

// Hamburger menu
document.getElementById('menu-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

// CRITICAL: Wait for full DOM + all modules loaded
function startApp() {
  log('startApp() called');

  // Force hide popups
  const calPopup = document.getElementById('calendar-popup');
  const forePopup = document.getElementById('forecast-popup');
  if (calPopup) calPopup.classList.remove('show');
  if (forePopup) forePopup.classList.remove('show');

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
