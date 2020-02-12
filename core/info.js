function helpness() {
	helpfulEl.innerHTML = findTile(activeTile).toString();
	helpfulEl.innerHTML += ` <button id='openInfo'>Open</button>`;
	let openInfoEl = document.getElementById('openInfo');
	openInfoEl.addEventListener('click', openInfo);
}

function openInfo() {
	spantextEl.innerHTML = findTile(activeTile).toString();
	modal.style.display = 'block';
}
