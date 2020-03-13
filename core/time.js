function timeTick() {
	map.onAll('changeTemperature');
	map.drawGame();

	//------------eco-----------

	for (building of player.buildings) {
		player.gold += 0.1;
	}

	//-----------------

	helpness();

	if (currentDir != 'none') {
		map.wind(currentDir);
	}

	if (map.activeMode == 'weather') {
		map.mapMode('weather');
	} else if (map.activeMode == 'temperature') {
		map.mapMode('temperature');
	}
	setTimeout(timeTick, 1000);
}
timeTick();
