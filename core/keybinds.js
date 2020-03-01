//----keybinds

document.addEventListener('keydown', keyClick);

function keyClick(e) {
	if (e.code == 'KeyA') {
		for (let i = 0; i < mapWidth * mapHeight; i++) {
			findTile(i).changeHeight();
		}
	} else if (e.code == 'KeyQ') {
		colorModes.none();
	} else if (e.code == 'KeyW') {
		mapMode('height');
	} else if (e.code == 'KeyE') {
		mapMode('region');
	} else if (e.code == 'KeyR') {
		mapMode('resource');
	} else if (e.code == 'KeyT') {
		mapMode('temperature');
	} else if (e.code == 'KeyY') {
		mapMode('climate');
	} else if (e.code == 'KeyU') {
		mapMode('weather');
	} else if (e.code == 'KeyI') {
		mapMode('seaRegion');
	} else if (e.code == 'Escape') {
		openMenu();
	}
}
