function helpness() {
	var natureNumber = 0;

	for (var i = 0; i < nature.length; i++) {
		if (nature[i].mapTile === Number(activeSelectTile)) {
			natureNumber = nature[i].id;
		}
	}

	helpfulEl.innerHTML = findTile(activeTile).toString();
}

function openMenu(){
	if(modal.style.display == 'none'){
		modal.style.display = 'block';
		spantextEl.innerHTML = `Menu<br>Continue<br>Sound<br>Settings<br>Quit`;
	} else {
		modal.style.display = 'none';
	}
}
