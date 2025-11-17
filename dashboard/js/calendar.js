// js/calendar.js
export function updateDateTime() {
  const now = new Date();

  // Format: "Monday, November 17, 2025 3:45pm"
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(' AM', 'am').replace(' PM', 'pm');

  const dateTimeEl = document.getElementById('date-time');
  if (dateTimeEl) {
    dateTimeEl.innerHTML = `${dateStr} <span class="text-gray-400">${timeStr}</span>`;
  }

  // Build mini calendar popup
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  let calendarHTML = `
    <div class="font-bold text-center mb-3 text-sm">
      ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
    </div>
    <div class="grid grid-cols-7 text-center text-xs mb-2 font-medium text-gray-400">
      <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
    </div>
    <div class="grid grid-cols-7 gap-1 text-center text-sm">
  `;

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<div></div>';
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today;
    const todayClass = isToday
      ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto'
      : '';
    calendarHTML += `<div class="${todayClass}">${day}</div>`;
  }

  calendarHTML += '</div>';

  const popupEl = document.getElementById('calendar-popup');
  if (popupEl) popupEl.innerHTML = calendarHTML;
}

// Safe hover handling — only attach once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const dateLinkParent = document.getElementById('date-time-link')?.parentElement;
  const calendarPopup = document.getElementById('calendar-popup');

  if (dateLinkParent && calendarPopup) {
    dateLinkParent.addEventListener('mouseenter', () => {
      calendarPopup.classList.add('show');
    });
    dateLinkParent.addEventListener('mouseleave', () => {
      calendarPopup.classList.remove('show');
    });
  }
});
