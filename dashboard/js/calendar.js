export function updateDateTime() {
  const n = new Date();
  const ds = n.toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  const ts = n.toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit', hour12:true}).replace(' AM','am').replace(' PM','pm');
  document.getElementById('date-time').innerHTML = `${ds} <span class="text-gray-400">${ts}</span>`;

  const y = n.getFullYear(), m = n.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  let cal = `<div class="font-bold text-center mb-3 text-sm">${n.toLocaleDateString('en-US',{month:'long', year:'numeric'})}</div>`;
  cal += '<div class="grid grid-cols-7 text-center text-xs mb-2 font-medium text-gray-400"><div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div></div>';
  cal += '<div class="grid grid-cols-7 gap-1 text-center text-sm">';
  for (let i = 0; i < firstDay; i++) cal += '<div></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const today = d === n.getDate() ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold' : '';
    cal += `<div class="${today}">${d}</div>`;
  }
  cal += '</div>';
  document.getElementById('calendar-popup').innerHTML = cal;
}

document.getElementById('date-time-link')?.parentElement.addEventListener('mouseenter', () => {
  document.getElementById('calendar-popup').classList.add('show');
});
document.getElementById('date-time-link')?.parentElement.addEventListener('mouseleave', () => {
  document.getElementById('calendar-popup').classList.remove('show');
});
