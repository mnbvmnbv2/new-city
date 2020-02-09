let currentDir = 'west';

function timeTick() {
	for (let i = 0; i < mapWidth * mapHeight; i++) {
		findTile(i).changeTemperature();
	}

	helpfulEl.innerHTML = findTile(activeTile).toString();

	if (currentDir != 'none') {
		wind(currentDir);
	}

	if (activeMode == 'weather') {
		mapMode('weather');
	} else if (activeMode == 'temperature') {
		mapMode('temperature');
	}
	//console.log('tick');
	setTimeout(timeTick, 1000);
}
timeTick();
