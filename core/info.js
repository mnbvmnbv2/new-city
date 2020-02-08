function helpness() {
	var natureNumber = 0;

	for (var i = 0; i < nature.length; i++) {
		if (nature[i].mapTile === Number(activeSelectTile)) {
			natureNumber = nature[i].id;
		}
	}

	helpfulEl.innerHTML = findTile(activeTile).toString();
}
