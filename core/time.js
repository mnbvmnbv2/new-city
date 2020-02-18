let currentDir = 'west';

function timeTick() {
	for (let i = 0; i < mapWidth * mapHeight; i++) {
		findTile(i).changeTemperature();
	}

	//------------eco-----------
	for (building of player.buildings) {
		player.gold += 0.1;
	}
	//-----------------

	helpness();

	if (currentDir != 'none') {
		wind(currentDir);
	}

	if (activeMode == 'weather') {
		mapMode('weather');
	} else if (activeMode == 'temperature') {
		mapMode('temperature');
	}
	setTimeout(timeTick, 1000);
}
timeTick();
