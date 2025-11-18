export function toggleMenu() {
  document.getElementById('sidebar-menu').classList.toggle('-translate-x-full');
}

export function showPopup(title, html, onSave) {
  document.getElementById('popup-title').textContent = title;
  document.getElementById('popup-form').innerHTML = html;
  document.getElementById('popup-save').onclick = () => { onSave(); closePopup(); };
  document.getElementById('popup').classList.remove('hidden');
}

export function closePopup() {
  document.getElementById('popup').classList.add('hidden');
}
