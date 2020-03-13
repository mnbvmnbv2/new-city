//----keybinds

document.addEventListener('keydown', keyClick);

function keyClick(e) {
	if (e.code == 'KeyA') {
		for (let i = 0; i < map.width * map.height; i++) {
			map.findTile(i).changeHeight();
		}
	} else if (e.code == 'KeyQ') {
		map.mapMode('none');
	} else if (e.code == 'KeyW') {
		map.mapMode('height');
	} else if (e.code == 'KeyE') {
		map.mapMode('landRegion');
	} else if (e.code == 'KeyR') {
		map.mapMode('resource');
	} else if (e.code == 'KeyT') {
		map.mapMode('temperature');
	} else if (e.code == 'KeyY') {
		map.mapMode('climate');
	} else if (e.code == 'KeyU') {
		map.mapMode('weather');
	} else if (e.code == 'KeyI') {
		map.mapMode('seaRegion');
	} else if (e.code == 'KeyO') {
		map.mapMode('tileNumber');
	} else if (e.code == 'Escape') {
		openMenu();
	}
}
