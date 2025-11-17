import { showPopup, closePopup } from './utils.js';

let data = [];

export function setData(d) {
  data = d;
}

// Make functions globally available for inline onclicks
window.ui = { addGroup, addLink };

export function render() {
  const container = document.getElementById('dashboard');
  container.innerHTML = '';
  data.forEach(group => {
    const details = document.createElement('details');
    details.open = true;
    details.className = 'bg-black rounded-lg overflow-hidden border border-gray-800 shadow-lg';

    const summary = document.createElement('summary');
    summary.className = 'flex items-center px-3 py-2 cursor-pointer select-none bg-gray-800 hover:bg-gray-700';
    summary.innerHTML = `
      <span class="w-1 h-9 ${group.color} rounded-r-sm mr-2"></span>
      <span class="font-bold ${group.textColor} text-sm">${group.name}</span>
      <svg class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    `;
    details.appendChild(summary);

    const grid = document.createElement('div');
    grid.className = 'p-3 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3 bg-black';

    (group.links || []).forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.className = 'icon text-center block';
      a.innerHTML = `
        <img src="${link.img}" class="w-20 h-20 mx-auto rounded object-contain bg-black"
             onerror="this.src='https://via.placeholder.com/80/111/fff?text=${encodeURIComponent((link.name||'?').substring(0,2))}'">
        <span class="block mt-1 text-xs text-gray-300">${link.name}</span>
      `;
      grid.appendChild(a);
    });

    details.appendChild(grid);
    container.appendChild(details);
  });
}

export function addGroup() {
  const form = `<input type="text" id="newGroupName" placeholder="Group Name" class="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2 text-white" required autofocus>`;
  showPopup('Add New Group', form, () => {
    const name = document.getElementById('newGroupName').value.trim();
    if (!name) return;
    const colors = ['bg-blue-500','bg-amber-500','bg-green-500','bg-purple-500','bg-pink-500','bg-emerald-500','bg-teal-500'];
    const textColors = ['text-blue-300','text-amber-300','text-green-300','text-purple-300','text-pink-300','text-emerald-300','text-teal-300'];
    data.push({
      name,
      color: colors[data.length % colors.length],
      textColor: textColors[data.length % textColors.length],
      links: []
    });
    localStorage.setItem('dashboardData', JSON.stringify(data));
    render();
  });
}

export function addLink() {
  const opts = data.length
    ? data.map((g, i) => `<option value="${i}">${g.name}</option>`).join('')
    : '<option disabled>No groups yet</option>';

  const form = `
    <select id="linkGroup" class="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2 text-white">${opts}</select>
    <input id="linkName" placeholder="Name" class="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2 text-white" required>
    <input id="linkUrl" placeholder="https://..." class="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2 text-white" required>
    <input id="linkImg" placeholder="Image URL (optional)" class="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2 text-white">
  `;

  showPopup('Add New Link', form, () => {
    const groupIdx = +document.getElementById('linkGroup').value;
    const name = document.getElementById('linkName').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const img = document.getElementById('linkImg').value.trim() ||
      `https://via.placeholder.com/80/111/fff?text=${encodeURIComponent(name.charAt(0))}`;

    if (!name || !url || isNaN(groupIdx)) return;

    data[groupIdx].links.push({ name, url, img });
    localStorage.setItem('dashboardData', JSON.stringify(data));
    render();
  });
}
