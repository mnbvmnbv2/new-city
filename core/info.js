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

let menuActive = false;

function openMenu() {
	if (menuActive == false) {
		menuActive = true;
		modal.style.display = 'block';
		spantextEl.innerHTML = `Menu<br>Pause<br>Settings<br>Resume`;
	} else {
		menuActive = false;
		modal.style.display = 'none';
	}
}
