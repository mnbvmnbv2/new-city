function seaMaker(mapTileId) {
	const type = 0;

	const name = 'test';
	let sea = new NatureClass(
		mapTileId, //mapTile
		type, //type 0-1
		Math.floor(Math.random() * 4) + 4, //food
		Math.floor(Math.random() * 4) + 2, //wood
		0, //stone
		0, //gold
		name //name
	);
	nature.push(sea);
}
